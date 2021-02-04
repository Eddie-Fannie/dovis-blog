# webpack的一些原理
## webpack将代码编译成什么

- `CommonJS`规范下的打包结果

```bash
mkdir webpack-demo
cd webpack-demo
npm inity -y

# 安装webapck
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

## loader
当我们串联地利用多个`loader`去转换一个文件时，每个`loader`都会链式地顺序执行。在`webpack`中，在同一文件存在多个匹配`loader`的情况下，各个`loader`的执行过程会遵循以下原则。
- `loader`的执行顺序和配置顺序是相反的，即配置的最后一个`loader`最先执行，第一个`loader`最后执行。
- 第一个执行的`loader`接收源文件的内容作为参数，其他`loader`接收前一个执行的`loader`的返回值作为参数。最后执行的`loader`会返回最终结果。

::: tip
`loader`就是一个基于`CommonJS`规范的函数模块，它接收内容（这里的内容可能是源文件，也可能是经过其他`loader`处理后的结果），并返回新的内容。

```js
module.exports = function(source) {
    return content
}
```

更进一步我们知道在配置`Webpack`时，可以对`loader`增加一些配置，比如著名的`babel-loader`的简单配置。

```js
module: {
    rules: [
        {
            test: /\.js$/,
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
```

这样一来，简单的`loader`写法便不能满足需求，因为编写`loader`时，除了编写`source`内容，还需要根据开发者配置的`options`信息进行构建定制化处理，以输出最后的结果。那么如何获取`options`，这时就需要用到`loader-utils`模块。

```js
const loaderUtils = require("loader-utils")
module.exports = function(source) {
    // 获取开发者配置的options
    const options = loaderUtils.getOptions(this)
    // some magic
    return content
}
```

对于`loader`返回的内容，实际开发中，单纯对`content`进行改写并返回改写后的内容，也许是不够的。比如，我们想对`loader`处理过程中的错误进行捕获，或者想导出`sourceMap`等信息时，该如何做？比如我们想对`loader`处理过程中的错误进行捕获，或者想导出`sourceMap`等信息时，该如何做呢？这种情况需要`loader`中的`this.callback`来返回内容。`this.callback`中可以传入`4`个参数，分别：
- `error`：当`loader`出错时向外抛出一个`error`
- `content`：经过`loader`编译后需要导出的内容
- `sourceMap`：为方便调试编译后的`source map`。
- `ast`：本次编译生成的抽象语法树。之后执行的`loader`可以直接使用这个`AST`，进而省去重复生成`AST`过程。
:::

使用`this.callback`后，我们的`loader`代码就会变得更加复杂，同时能够处理更加多样的需求，比如。
```js
module.exports = function(source) {
    // 获取开发者配置的options
    const options = loaderUtils.getOptions(this)
    // some magic
    // return content
    this.callback(null,content)
}
```
> 当使用`this.callback`返回内容时，该`loader`必须返回`undefined`，这样`webpack`就知道该`loader`返回的结果在`this.callback`中，而不在`return`中。这里的`this`指向的是一个叫`loaderContext`的`loader-runner`特有对象。

## Tree Shaking原理
- 编译阶段利用ES6 Module判断哪些模块已经加载
- 判断哪些模块和变量未被使用或者引用，进而删除对应代码。

