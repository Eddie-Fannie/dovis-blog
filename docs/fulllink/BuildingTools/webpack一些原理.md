# webpack的一些原理
## webpack 按需加载的模块怎么在浏览器中运行

源码：
```js
// index.js
import("./hello").then((result) => {
    console.log(result.default);
});

// hello.js
export default 'hello';
```

产物代码：
```js
// PS: 对代码做了部分简化及优化， 否则太难读了～～～
// 定一个模块对象
var modules = ({});
// webpack在浏览器里实现require方法
function require(moduleId) {xxx}

/**
 * chunkIds 代码块的ID数组
 * moreModules 代码块的模块定义
*/
function webpackJsonpCallback([chunkIds, moreModules]) {
  const result = [];
  for(let i = 0 ; i < chunkIds.length ; i++){
    const chunkId = chunkIds[i];
    result.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0; // 0 表示此代码块已经下载完毕
  }

  // 将代码块合并到 modules 对象中去
  for(const moduleId in moreModules){
    modules[moduleId] = moreModules[moduleId];
  }
  //依次将require.e方法中的promise变为成功态
  while(result.length){
    result.shift()();
  }
}

// 用来存放代码块的加载状态， key是代码块的名字
// 每次打包至少产生main的代码块
// 0 表示已经加载就绪
var installedChunks = {
  "main": 0
}

require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  }
};
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
};

// 给require方法定义一个m属性， 指向模块定义对象
require.m = modules;

require.f = {};

// 利用JSONP加载一个按需引入的模块
require.l = function (url) {
  let script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
}

// 用于通过JSONP异步加载一个chunkId对应的代码块文件， 其实就是hello.main.js
require.f.j = function(chunkId, promises){
  let installedChunkData;
  // 当前代码块的数据
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  promises.push(installedChunkData[2] = promise);
  // 获取模块的访问路径
  const url = chunkId + '.main.js';

  require.l(url);
}

require.e = function(chunkId) {
  let promises = [];
  require.f.j(chunkId, promises);
  console.log(promises);
  return Promise.all(promises);
}

var chunkLoadingGlobal = window['webpack'] = [];
// 由于按需加载的模块， 会在加载成功后调用此模块，所以这是JSONP的成功后的回掉
chunkLoadingGlobal.push = webpackJsonpCallback;

/**
 * require.e异步加载hello代码块文件 hello.main.js
 * promise成功后会把 hello.main.js里面的代码定义合并到require.m对象上，也就是modules上
 * 调用require方法加载./src/hello.js模块，获取 模块的导出对象，进行打印
 */
require.e('hello').then(require.bind(require, './src/hello.js')).then(result => console.log(result));



// hello.main.js
"use strict";
(self["webpack"] = self["webpack"] || []).push([
  ["hello"], {
    "./src/hello.js": ((module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        "default": () => (_DEFAULT_EXPORT__)
      });
      const _DEFAULT_EXPORT__ = ("hello");
    })
  }
]);
```
> `webpack` 在产物代码中声明了一个全局变量 `webpack` 并赋值为一个数组，然后改写了这个数组的 `push` 方法。在异步代码加载完成后执行时，会调用这个 `push` 方法，在重写的方法内会将异步模块放到全局模块中然后等待使用。

## webpack将代码编译成什么

- `CommonJS`规范下的打包结果

```bash
mkdir webpack-demo
cd webpack-demo
npm init -y

# 安装webpack
npm install --save-dev webpack
npm install --save-dev webpack-cli
```

1. 在根目录下新建一个`index.html`。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="./dist/main.js"></script>
</body>
</html>
```

2. 然后新建`./src`文件夹，在`src`文件夹中，因为我们要研究模块化打包产出，这涉及依赖关系，所以要在`./src`目录下新建`hello.js`和`index.js`。`index.js`作为入口脚本，依赖`hello.js`

```js
// hello.js
module.exports = function(name) {
    return 'hello ' + name
}

// index.js
const sayHello = require('./hello')
console.log(sayHello('lucas'))
```

> 这里采用`CommonJS`规范，也没有加入`Babel`编译环节。直接执行以下命令，可以得出产出，产出内容出现在`./dist`文件中。

```bash
node_modules/.bin/webpack --mode development
```

::: tip
打包完其实是一个立即调用函数表达式
- `webpack`的打包结果就是一个立即调用函数表达式，一般被称为`webpackBootstrap`，这个`IIFE`接收一个对象`modules`作为参数，`modules`对象的`key`是依赖路径，`value`是经过简单处理后的脚本
- 打包结果中定义一个重要的模块加载函数`__webpack_require__`
- 首先使用模块加载函数`__webpack_require__`去加载入口模块`./src/index.js`。
- 加载函数`__webpack_require__`使用了闭包变量`installedModules`，它的作用是将已加载过的模块结果保存在内存中
:::

- `ES`规范下的打包结果
> 业务代码往往遵循`ES Next`模块化标准，并通过`Babel`进行编译

```bash
npm install --save-dev webpack
npm install --save-dev webpack-cli
npm install --save-dev babel-loader
npm install --save-dev @babel-core
npm install --save-dev @babel/preset-env
```

同时配置`package.json`
```bash
"build": "webpack --mode development --progress --display-modules --colors --display-reasons"

"babel": {
    "presets": ["@babel/preset-env"]
  },
```

```js
// hello.js
const sayHello = name => `hello ${name}`
export default sayHello

// index.js
import sayHello from './hello'
console.log(sayHello('linjiaheng'))
```

::: tip
输出打包后的结果，发现在`main.js`语句中多了个：`__webpack_require__.r(__webpack_exports__)`。实际上，`__webpack_require_.r`这个方法是用来给模块的`exports`对象加上`ES`模块化规范的标记的。

具体标记方式：如果当前环境支持`Symbol`对象，则可以通过`Object.defineProperty`为`exports`对象的`Symbol.toStringTag`属性赋值`Module`，这样做的结果是`exports`对象在调用`toString`方法时会返回`Module`，同时将`exports.esModule`赋值为`true`
:::

- 按需加载下的打包结果
```bash
npm install --save-dev babel-plugin-dynamic-webpack
```
在`webpack.config.js`中添加相关插件配置
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/，
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    "plugins": [
                        "dynamic-import-webpack"
                    ]
                }
            }
        ]
    }
}
```

```js
// index.js
import('./hello').then(sayHello => {
    console.log(sayHello('linjiaheng'))
})
```
> 这样一来就会发现构建后会输出两个文件，分别是执行入口的`main.js`和异步加载文件`0.js`。因为异步按需加载时，我们显然不能把所有代码再打包到一个`bundle`中了。相比常规打包产出的结果，按需加载下打包的产出结果变化比较大，也更加复杂，变化：

- 多了一个`__webpack_require__.e`
- 多了一个`webpackJsonp`
> `__webpack_require__.e`实现非常重要，初始化一个`Promise`数组，使用`Promise.all()`异步插入`script`脚本；`webpackJsonp`会挂载到全局对象`window`上，进行模块安装。

## webpack工作基本原理
- 首先，`webpack`会读取项目中由开发者定义的`webpack.config.js`配置文件，或者从`shell`语句中获得必要的参数。这是由`webpack`内部接收业务配置信息的方式。这样就完成了配置读取的初步工作。
- 接着，将所需的`webpack`插件实例化，在`webpack`事件流上挂载插件钩子，这样在合适的构建过程中，插件就具备改动产出结果的能力。
- 同时根据配置所定义的入口文件，从入口文件开始，进行依赖收集。对所有依赖的文件进行编译，这个编译过程依赖`loaders`，不同类型的文件根据开发者定义的不同`loader`进行解析。编译好的内容使用`acorn`或其他抽象语法树能力，解析成抽象语法树，分析文件依赖关系，将不同模块化语法（如`require`)等替换为`__webpack_require__`，即使用`webpack`自己的加载器进行模块化实现。
- 上述完成后，产出结果，根据开发者配置，将结果打包到相应目录。

::: tip
在整个打包的过程中，`webpack`和插件都采用基于事件流的发布/订阅模式，监听某些关键过程，并在这些环节中执行插件任务。最后所有文件的编译和转化都已经完成，输出最终资源。

+ `webpack`的打包过程
    - 从入口文件开始，分析整个应用的依赖树
    - 将每个依赖模块包装起来，放到一个数组中等待调用
    - 实现模块加载的方法，并把它放到模块执行的环境中，确保模块间可以互相调用。
    - 把执行入口文件的逻辑放在一个函数表达式中，并立即执行这个函数。
:::

