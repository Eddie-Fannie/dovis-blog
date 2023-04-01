如何才能让我们的工程在使用模块化的同时也能正常运行在浏览器中呢？模块打包工具闪亮登场。模块打包工具（`module bundler`）的任务就是解决模块间的依赖，使其打包后的结果能运行在浏览器上。它的工作方式主要分为两种。

- 将存在依赖关系的模块按照特定规则合并为单个 `JS` 文件，一次全部加载进页面中。
- 在页面初始时加载一个入口模块，异步加载其他模块。

# webpack学习
> `Webpack` 是一个开源的JavaScript模块打包工具，其最核心的功能是解决模块之间的依赖，把各个模块按照特定的规则和顺序组织在一起，最终合并为一个`JS`文件（有时会有多个，这里讨论的只是最基本的情况）。这个过程就叫作模块打包。你可以把 `Webpack` 理解为一个模块处理工厂。我们把源代码交给 `Webpack` ，由它去进行加工、拼装处理，产出最终的资源文件，等待送往用户。

`webpack`优势：
1）`Webpack` 默认支持多种模块标准，包括 `AMD`、`CommonJS` 以及最新的 `ES6` 模块，而其他工具大多只能支持一到两种。`Webpack`对于一些同时使用多种模块标准的工程非常有用，它会帮我们处理好不同类型模块之间的依赖关系。
2）`Webpack` 有完备的代码分片解决方案。从字面意思去理解，它可以分割打包后的资源，在首屏只加载必要的部分，将不太重要的功能放到后面动态加载。这对于资源体积较大的应用来说尤为重要，可以有效地减小资源体积，提升首页渲染速度。
3）`Webpack` 可以处理各种类型的资源。除了 `JavaScript` 以外，`Webpack` 还可以处理样式、模板，甚至图片等，而开发者需要做的仅仅是导入它们。比如你可以从 `JavaScript`文件导入一个 `CSS` 或者 `PNG` ，而这一切最终都可以由 `loader` 来处理。
4）`Webpack` 拥有庞大的社区支持。除了 `Webpack` 核心库以外，还有无数开发者来为它编写周边插件和工具。对于绝大多数的需求，你都可以直接在社区找到已有解决方案，甚至会找到多个解决方案。

`webpack`相关注意点：
- `scripts` 是 `npm` 提供的脚本命令功能，在这里我们可以直接使用由模块添加的指令
- `Webpack` 对于 `output.path` 的要求是使用绝对路径（从系统根目录开始的完整路径），之前我们在命令行中为了简洁而使用了相对路径。而在 `webpack.config.js` 中，我们通过调用 `Node.js` 的路径拼装函数 `path.join` ，将 `__dirname`（`Node.js`内置全局变量，**值为当前文件所在的绝对路径**）与 `dist`（输出目录）连接起来，得到了最终的资源输出路径。
- 直接用 `Webpack` 开发和使用 `webpack-dev-server` 有一个很大的区别，前者每次都会生成构建产物，而 `webpack-dev-server` 只是将打包结果放在内存中，并不会写入实际的 `bundle.js`，在每次 `webpack-dev-server` 接收到请求时都只是将内存中的打包结果返回给浏览器。
- `chunk` 字面的意思是代码块，在 `Webpack` 中可以理解成被抽象和包装后的一些模块。它就像一个装着很多文件的文件袋，里面的文件就是各个模块，`Webpack` 在外面加了一层包裹，从而形成了 `chunk` 。根据具体配置不同，一个工程打包时可能会产生一个或多个 `chunk` 。**`Webpack` 会从入口文件开始检索，并将具有依赖关系的模块生成一棵依赖树，最终得到一个 `chunk` 。我们一般将由这个 `chunk` 得到的打包产物称为 `bundle` 。**

## webpack 运行机制
`webpack` 运行流程简图

![img](/dovis-blog/webpack/1.png)

`webpack`会在各个生命周期中广播事件，插件坚挺到对应的事件便会触发
![img](/dovis-blog/webpack/2.png)


## `plugin`
> 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括打包优化，资源管理，注入环境变量。想要使用一个插件，只需要`require()`它，然后把它添加到`plugins`数组中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

## `loader`
:::tip
那么 `loader` 是一个纯函数吗？
`Loader` 不是纯函数，主要有两个原因：
1. `loader` 有执行上下文（context)，也就是通过`this`访问内置的属性和方法，以实现特定的功能
2. `loader`的return语句不一定有返回
:::

# vite学习