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

# vite 学习
> `vite` 在开发环境和生产环境分别做了不同的处理，在开发环境中底层基于 `esBuild` 进行提速，在生产环境中使用 `rollup` 进行打包。

:::tip
- `esBuild` 是选择 `Go` 语言编写的，而在 `esBuild` 之前，前端构建工具都是基于 `Node`，使用 `JS` 进行编写。`JavaScript` 是一门解释性脚本语言，即使 `V8` 引擎做了大量优化（`JWT` 及时编译），本质上还是无法打破性能的瓶颈。而 `Go` 是一种编译型语言，在编译阶段就已经将源码转译为机器码，启动时只需要直接执行这些机器码即可。
- `Go` 天生具有多线程运行能力，而 `JavaScript` 本质上是一门单线程语言。`esBuild` 经过精心的设计，将代码 `parse`、代码生成等过程实现完全并行处理。
:::

## 为什么 vite 开发服务这么快
传统 `bundle based` 服务：
- 无论是 `webpack` 还是 `rollup` 提供给开发者使用的服务，都是基于构建结果的。
- 基于构建结果提供服务，意味着提供服务前一定要构建结束，随着项目膨胀，等待时间也会逐渐变长。

`noBundle` 服务：
- 对于 `vite`、`snowpack` 这类工具，提供的都是 `noBundle` 服务，无需等待构建，直接提供服务。
- 对于项目中的第三方依赖，仅在初次启动和依赖变化时重构建，会执行一个依赖预构建的过程。由于是基于 `esBuild` 做的构建所以非常快。**在启动服务器之前会先读取你的 `package.json` 文件，识别出需要进行预编译的包，先进行预编译之后，再去启动服务器。`Vite` 在预构建阶段，将构建后的依赖缓存到 `node_modules/.vite`，相关配置更改时，或手动控制时才会重新构建，以提升预构建速度。**
- 对于项目代码，则会依赖于浏览器的 `ESM` 的支持，直接按需访问，不必全量构建。**服务器只在接受到 `import` 请求的时候，才会编译对应的文件，将 `ESM` 源码返回给浏览器，实现真正的按需加载。**
- 充分利用 `http` 缓存做优化，依赖（不会变动的代码）部分用 `max-age,immutable` 强缓存，源码部分用 `304` 协商缓存，提升页面打开速度。

## 为什么生产环境要用 rollup
- 由于浏览器的兼容性问题以及实际网络中使用 `ESM` 可能会造成 `RTT` 时间过长，所以仍然需要打包构建。
- `esbuild` 虽然快，但是它还没有发布 1.0 稳定版本，另外 `esbuild` 对代码分割和 `css` 处理等支持较弱，所以生产环境仍然使用 `rollup` 。

## 为什么代码可以直接在浏览器上运行
> 在开发环境时，我们使用 `vite` 开发，是无需打包的，直接利用浏览器对 `ESM` 的支持，就可以访问我们写的组件代码，但是一些组件代码文件往往不是 `JS` 文件，而是 `.ts、.tsx、.vue` 等类型的文件。这些文件浏览器肯定直接是识别不了的。

![img](/dovis-blog/other/94.png)

> 我们可以观察到 `vue` 这个第三方包的访问路径改变了，变成了 `node_modules/.vite` 下的一个 `vue` 文件，这里真正访问的文件就是前面我们提到的，`vite` 会对第三方依赖进行依赖预构建所生成的缓存文件。**`ESM` 不支持裸模块，`ESM` 只能接受 `Content-Type` 为 `application/javascript` 类型**

> `npm` 包中大量的 `ESM` 代码，大量的 `import` 请求，会造成网络拥塞。`Vite` 使用 `esbuild`，将有大量内部模块的 `ESM` 关系转换成单个模块，以减少 `import` 模块请求次数。

浏览器也对 `App.vue` 发起了访问，简化后的代码：

```js
const _sfc_main = {
  name: 'App'
}
// vue 提供的一些API，用于生成block、虚拟DOM
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "/node_modules/.vite/vue.js?v=b618a526"

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("h1", null, "App"))
}
// 组件的render方法
_sfc_main.render = _sfc_render;
export default _sfc_main;
```
> **当用户访问 `vite` 提供的开发服务器时，对于浏览器不能直接识别的文件，服务器的一些中间件会将此类文件转换成浏览器认识的文件，从而保证正常访问。**

:::tip
其他文件转换：
- 将图片转为 `base64` 格式，在 `Vite` 当中，只有图片足够小才会使用 `base64` 的格式
:::

# Rollup 学习
## 为什么 Rollup 产物那么干净
- `rollup` 只对 `ESM` 模块进行打包，对于 `cjs` 模块也会通过插件将其转化为 `ESM` 模块进行打包。所以不会像 `webpack` 有很多的代码注入。
- `rollup` 对打包结果也支持多种 `format` 的输出，比如：`esm、cjs、am` 等等，但是 `rollup` 并不保证代码可靠运行，需要运行环境可靠支持。比如我们输出 `esm` 规范代码，代码运行时完全依赖高版本浏览器原生去支持 `esm`，`rollup` 不会像 `webpack` 一样注入一系列兼容代码。
- `rollup` 实现了强大的 `tree-shaking` 能力。