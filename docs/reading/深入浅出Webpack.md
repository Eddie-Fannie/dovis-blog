# 4. 深入浅出Webpack
## 第一章 入门
### 1.1. 模块化
1. `CommonJS`（http：//www.commonjs.org）是一种被广泛使用的 `JavaScript` 模块化规范，其核心思想是通过`require`方法来同步加载依赖的其他模块，通过`module.exports`导出需要暴露的接口。

> `CommonJS`优点：
> - 代码可复用于`Node.js`环境并运行
> - 通过`NPM`发布很多第三方模块都采用`CommonJS`规范
> `CommonJS` 的缺点在于，这样的代码无法直接运行在浏览器环境下，必须通过工具转换成标准的`ES5`

2. `AMD`也是一种JavaScript模块化规范，与`CommonJS`最大的不同在于，它采用了异步的方式去加载依赖的模块。AMD规范主要用于解决针对浏览器环境的模块化问题，最具代表性的实现是 requirejs（http：//requirejs.org）。
> `AMD`的优点在于：
> - 可在不转换代码的情况下直接在浏览器中运行
> - 可异步加载依赖;
> - 可并行加载多个依赖；
> - 代码可运行在浏览器环境和`Node.js`环境下。
> `AMD`的缺点在于:
> - JavaScript运行环境没有原生支持`AMD`，需要先导入实现了`AMD`的库后才能正常使用。

### 1.3 安装Webpack
1. `Webpack`是一个打包模块化`JavaScript`的工具，它会从入口文件`main.js`出发，识别出源码中的模块化导入语句，递归地找出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。

### 1.4 使用Loader
1. 每个 `Loader` 都可以通过 `URL querystring` 的方式传入参数，例如 `css-loader？minimize`中的`minimize`告诉`css-loader`要开启`CSS`压缩。
2. 向`Loader`传入属性的方式除了可以通过`querystring`实现，还可以通过`Object`实现，配置文件中的`options`属性

### 1.6 使用DevServer
1. 通过`DevServer`启动的`Webpack`会开启监听模式，当发生变化时重新执行构建，然后通知`DevServer`。`DevServer`会让`Webpack`在构建出的`JavaScript`代码里注入一个代理客户端用于控制网页，网页和`DevServer`之间通过`WebSocket`协议通信，以方便`DevServer`主动向客户端发送命令。`DevServer`在收到来自`Webpack`的文件变化通知时，通过注入的客户端控制网页刷新。
2. 如果尝试修改`index.html`文件并保存，则我们会发现这并不会触发以上机制，导致这个问题的原因是`Webpack`在启动时会以配置里的`entry`为入口去递归解析出`entry`所依赖的文件，只有`entry`本身和依赖的文件才会被`Webpack`添加到监听列表里。而`index.html`文件是脱离了`JavaScript`模块化系统的，所以`Webpack`不知道它的存在。
3. `Webpack`支持生成`Source Map`，只需在启动时带上`--devtool source-map`参数。重启 `DevServer`后刷新页面，再打开 `Chrome`浏览器的开发者工具，就可以在 `Sources`栏中看到可调试的源代码了。

### 1.7 核心概念
1. `Module`：模块，在`Webpack`里一切皆模块，一个模块对应一个文件。`Webpack`会从配置的`Entry`开始递归找出所有依赖的模块。
2. `Chunk`：代码块，一个`Chunk`由多个模块组合而成，用于代码合并与分割。

> `Webpack`在启动后会从`Entry`里配置的`Module`开始，递归解析`Entry`依赖的所有`Module`。每找到一个`Module`，就会根据配置的`Loader`去找出对应的转换规则，对`Module`进行转换后，再解析出当前`Module`依赖的`Module`。这些模块会以`Entry`为单位进行分组，一个`Entry`及其所有依赖的`Module`被分到一个组也就是一个`Chunk`。最后，`Webpack`会将所有`Chunk`转换成文件输出。在整个流程中，`Webpack`会在恰当的时机执行`Plugin`里定义的逻辑。

## 第五章 原理
### 5.4 plugin
> `Webpack`通过`Plugin`机制让其更灵活，以适应各种应用场景。在`Webpack`运行的生命周期中会广播许多事件，`Plugin`可以监听这些事件，在合适的时机通过`Webpack`提供的`API`改变输出结果。

一个最基础的`plugin`代码：
```js
class BasicPlugin{
  // 在构造函数中获取用户为该插件传入的配置
  constructor(options) {

  }
  // webpack会调用BasicPlugin实例的apply方法为插件实例传入compiler对象
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {

    })
  }
}

// 导出plugin
module.exports = BasicPlugin;

// 使用时相关配置
const BasicPlugin = require('./BasicPlugin.js');
module.exports = {
  plugins: [
    new BasicPlugin(options),
  ]
}
```

> `Webpack`启动后，在读取配置的过程中会先执行`new BasicPlugin（options）`，初始化一个 `BasicPlugin` 并获得其实例。在初始化 `compiler` 对象后，再调用`basicPlugin.apply（compiler）`为插件实例传入 `compiler` 对象。插件实例在获取到`compiler` 对象后，就可以通过 `compiler.plugin`（事件名称，回调函数）监听到`Webpack` 广播的事件，并且可以通过`compiler` 对象去操作`Webpack`。

#### 5.4.1 Compiler和Compilation
> 在开发`Plugin`时最常用的两个对象就是`Compiler`和`Compilation`，它们是`Plugin`和`Webpack`之间的桥梁。

::: tip
`Compiler`对象包含了`Webpack`环境的所有配置信息，包含`options`、`loaders`、`plugins`等信息。这个对象在 `Webpack` 启动时被实例化，它是全局唯一的，可以简单地将它理解为`Webpack`实例。

`Compilation`对象包含了当前的模块资源、编译生成资源、变化的文件等。当`Webpack`以开发模式运行时，每当检测到一个文件发生变化，便有一次新的`Compilation`被创建。`Compilation`对象也提供了很多事件回调供插件进行扩展。通过`Compilation`也能读取到`Compiler`对象。

`Compiler`和`Compilation`的区别在于：`Compiler`代表了整个`Webpack`从启动到关闭的生命周期，而`Compilation`只代表一次新的编译。
:::

#### 5.4.2事件流
> `Webpack`就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。这条生产线上的每个处理流程的职责都是单一的，多个流程之间存在依赖关系，只有在完成当前处理后才能提交给下一个流程去处理。插件就像插入生产线中的某个功能，在特定的时机对生产线上的资源进行处理。

`Webpack`通过`Tapable`来组织这条生产线。**`Webpack`在运行的过程中会广播事件，插件只需要监听它所关心的事件，就能加入这条生产线中，去改变生产线的运作。`Webpack`的事件流机制保证了插件的有序性，使得整个系统的扩展性良好。**

`Webpack`的事件流机制应用了观察者模式，和Node.js中的`EventEmitter`非常相似。`Compiler`和`Compilation`都继承自`Tapable`，可以直接在`Compiler`和`Compilation`对象上广播和监听事件。

```js
/ **
* 广播事件
* event-name为事件名称，注意不要和现有事件重名
* params为附带的参数
/
compiler.apply('event-name', params);

/ **
* 监听名称为event-name的事件，当event-name事件发生时，函数就会被执行。
* 同时函数中的params 参数为广播事件时附带的参数。
/
compiler.plugin('event-name', function(params) {

})
```

::: tip
在开发插件时，还需要注意以下两点：只要能拿到`Compiler`或`Compilation`对象，就能广播新的事件，所以在新开发的插件中也能广播事件，为其他插件监听使用。传给每个插件的`Compiler`和`Compilation`对象都是同一个引用。也就是说，若在一个插件中修改了`Compiler`或`Compilation`对象上的属性，就会影响到后面的插件。有些事件是异步的，这些异步的事件就会附带两个参数，第2个参数为回调函数，在插件处理完任务时需要调用回调函数通知`Webpack`，才会进入下一个处理流程。

```js
compiler.plugin('emit', function(compilation, callback) {
  // 支持处理逻辑
  // 处理完毕后执行callback已通知Webpack
  // 如果不执行callback，运行流程会一直卡在这里不往后执行
  callback();
})
```
:::

#### 5.4.3 最常用的API
1. 读取输出资源，代码块，模块及其依赖
`emit`事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。

```js
compiler.plugin('emit', function(compilation, callback) {
  // compilation.chunks存放所有代码块，是一个数组
  compilation.chunks.forEach(function(chunk) {
    // chunk代表一个代码块
    // 代码块由多个模块组成，通过chunk.forEachModule能读取代码块的每个模块
    chunk.forEachModule(function(module) {
      // module代表一个模块
      // module.fileDependencies存放当前模块的所有依赖的文件路径，是一个数组
      module.fileDependencies.forEach(function(filepath){

      })
    })

    // webpack会根据chunk生成输出的文件资源，每个chunk都对应一个及以上的输出文件
    // 例如在chunk中包含css模块并且使用了ExtractTextPlugin时，
    // 该chunk就会生成.js和.css两个文件
    chunk.files.forEach(function(filename) {
      // compilation.assets存放当前即将输出的所有资源
      // 调用一个输出资源的source()方法能获取输出资源的内容
      let source = compilation.assets[filename].source();
    })
  })
  // 这是一个异步事件，要记得调用callback来通知Webpack本次事件监听处理结束
  // 如果忘记了调用callback，则webpack将一直卡在这里而不会往后执行
  callback()
})
```

2. 监听文件的变化
在开发插件时经常需要知道是哪个文件发生的变化导致了新的`Compilation`，为此可以使用如下代码：

```js
// 当依赖的文件发生变化时会触发watch-run事件
compiler.plugin('watch-run', (watching, callback) => {
  // 获取发生变化时的文件列表
  const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
  // changedFiles格式为键值对，键为发生变化的文件路径。
  if (changedFiles[filePath] !== undefined) {
    // filePath对应的文件发生了变化
  }
  callback()
})
```
在默认情况下，webpack只会监视入口和其依赖的模块是否发生了变化，在某些情况下项目可能需要引入新的文件，例如引入一个`HTML`文件。由于JS文件不会导入HTML文件，所以webpack不会监听HTML文件的变化，编辑HTML文件时就不会重新触发新的`Compilation`。为了监听HTML文件变化，我们需要将HTML文件加入依赖列表中：

```js
compiler.plugin('after-compile', (compilation, callback) => {
  // 将HTML文件添加到文件依赖列表中，好让Webpack监听HTML模版文件，在HTML模版文件变化时重新启动一次编译。
  compilation.fileDependencies.push(filePath);
  callback()
})
```

3. 修改输出资源
在某些场景下插件需要修改，增加，删除输出的资源，要做到这点则需要监听`emit`事件，因为发生`emit`事件时所有模块的转换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此`emit`事件时修改`webpack`输出资源的最后的时机。**所有需要输出的资源都会被存放在`compilation.assets`中，`compilation.assets`是一个键值对，键为需要输出的文件名称，值为文件对应的内容。**

```js
// 设置compilation.assets的代码如下：
compiler.plugin('emit', (compilation, callback) => {
  // 设置名称为fileName的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent既可以是代表文本文件的字符串，也可以是代表二进制文件的Buffer
      return fileContent;
    },
    size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  }
  callback()
})
```
读取`compilation.assets`的代码如下：
```js
compiler.plugin('emit', (compilation, callback) => {
  // 读取名称为fileName的输出资源
  const assets = compilation.assets[fileName];
  // 获取输出资源的内容
  assets.source()
  // 获取输出资源的文件大小
  asset.size()
  callback()
})
```

4. 判断Webpack使用了哪些插件
在开发一个插件时，我们可能需要根据当前配置是否使用了其他插件来做下一步决定，因此需要读取`Webpack`当前的插件配置情况。比如，若想判断当前是否使用了`ExtractTextPlugin`，则可以使用如下代码：

```js
// 判断当前配置是否使用了ExtractTextPlugin
// compiler参数为webpack在apply(compiler)中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置使用的所有插件列表
  const plugins = compiler.options.plugins;
  // 去plugins中寻找有没有ExtractTextplugin的实例
  return plugins.find(plugin => plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```

::: tip
`ExtractTextPlugin`插件它会将所有的入口 `chunk(entry chunks)`中引用的 `*.css`，移动到独立分离的 `CSS` 文件。因此，你的样式将不再内嵌到 `JS bundle` 中，而是会放到一个单独的 `CSS` 文件（即 `styles.css`）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 `CSS bundle` 会跟 `JS bundle` 并行加载。

在`Webpack 4.0`以后将使用`mini-css-extract-plugin`代替
:::
