# 简单实现 webpack
```js
class Compilation {
    constructor(options) {
        this.options = options;
        // 本次编译所有生成出来的模块
        this.modules = [];
        // 本次编译产出的所有代码块, 入口模块和依赖模块打包在一起成为代码块
        this.chunks = [];
        // 本次编译产出的资源文件
        this.assets = {};
    }
    build(callback) {
        //5.根据配置文件中的`entry`配置项找到所有的入口
        let entry = {xxx: 'xxx'};

        //6.从入口文件出发，调用所有配置的loader规则，比如说loader对模块进行编译
        for(let entryName in entry){
            // 6. 从入口文件出发,调用所有配置的Loader对模块进行编译
            const entryModule = this.buildModule(entryName, entryFilePath);
            this.modules.push(entryModule);

            //8.等把所有的模块编译完成后，根据模块之间的依赖关系，组装成一个个包含多个模块的chunk
            let chunk = {
                name: entryName, // 代码块的名称就是入口的名称
                entryModule, // 此代码块对应的入口模块
                modules: this.modules.filter((module) => module.names.includes(entryName)) // 此代码块包含的依赖模块
            };
            this.chunks.push(chunk);
        }

        //9.再把各个代码块chunk转换成一个一个的文件(asset)加入到输出列表
        this.chunks.forEach((chunk) => {
            const filename = this.options.output.filename.replace('[name]', chunk.name); // 获取输出文件名称
            this.assets[filename] = getSource(chunk);
        });
        // 调用编译结束的回掉
        callback(null, {
            modules: this.modules,
            chunks: this.chunks,
            assets: this.assets
        }, this.fileDependencies);

    }

    //当你编译 模块的时候，需要传递你这个模块是属于哪个代码块的，传入代码块的名称
    buildModule(name, modulePath) {
         // 6. 从入口文件出发,调用所有配置的Loader对模块进行编译, loader 只会在编译过程中使用， plugin则会贯穿整个流程
         // 读取模块内容
         let sourceCode = fs.readFileSync(modulePath, 'utf8');
         //创建一个模块对象
         let module = {
             id: moduleId, // 模块ID =》 相对于工作目录的相对路径
             names: [name], // 表示当前的模块属于哪个代码块（chunk）
             dependencies: [], // 表示当前模块依赖的模块
         }

         // 查找所有匹配的loader，自右向左读取loader， 进行转译， 通过loader翻译后的内容一定是JS内容
         sourceCode = loaders.reduceRight((sourceCode, loader) => {
             return require(loader)(sourceCode);
         }, sourceCode);

         // 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
         // 创建语法树, 遍历语法树，在此过程进行依赖收集， 绘制依赖图
         let ast = parser.parse(sourceCode, { sourceType: 'module' });
         traverse(ast, {});
         let { code } = generator(ast);

         // 把转译后的源代码放到module._source上
         module._source = code;
         // 再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
         module.dependencies.forEach(({ depModuleId, depModulePath }) => {
            const depModule = this.buildModule(name, depModulePath);
            this.modules.push(depModule)
         });

         return module;
    }
}

function getSource(chunk) {
    return `
     (() => {
      var modules = {
        ${chunk.modules.map(
          (module) => `
          "${module.id}": (module) => {
            ${module._source}
          }
        `
      )}
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
        modules[moduleId](module, module.exports, require "moduleId");
        return module.exports;
      }
      var exports ={};
      ${chunk.entryModule._source}
    })();
     `;
}

class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(),  //会在编译刚开始的时候触发此run钩子
            done: new SyncHook(), //会在编译 结束的时候触发此done钩子
        }
    }

    //4.执行`Compiler`对象的`run`方法开始执行编译
    run() {
        // 在编译前触发run钩子执行， 表示开始启动编译了
        this.hooks.run.call();
        // 编译成功之后的回掉
        const onCompiled = (err, stats, fileDependencies) => {
            // 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
            for(let filename in stats.assets) {
                fs.writeFileSync(filePath,stats.assets[filename], 'utf8' );
            }
            //当编译成功后会触发done这个钩子执行
            this.hooks.done.call();
        }
        //开始编译，编译 成功之后调用onCompiled方法
        this.compile(onCompiled);
    }

    compile(callback) {
        // webpack虽然只有一个Compiler， 但是每次编译都会产出一个新的Compilation, 用来存放本次编译产出的 文件、chunk、和模块
        // 比如：监听模式会触发多次编译
        let compilation = new Compilation(this.options);
        //执行compilation的build方法进行编译 ，编译 成功之后执行回调
        compilation.build(callback);
    }

}

function webpack(options) {
    //1.初始化参数，从配置文件和shell语句中读取并合并参数，并得到最终的配置对象
    let finalOptions = {...options, ...shellOptions};

    // 2.用上一步的配置对象初始化Compiler对象， 整个编译流程只有一个complier对象
    const compiler = new Compiler(finalOptions);

    // 3.加载所有在配置文件中配置的插件
    const { plugins } = finalOptions;
    for(let plugin of plugins){
        plugin.apply(compiler);
    }

    return compiler;
}

// webpackOptions webpack的配置项
const compiler = webpack(webpackOptions);
//4.执行对象的run方法开始执行编译
compiler.run();
```