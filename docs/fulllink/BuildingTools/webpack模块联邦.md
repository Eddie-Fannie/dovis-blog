# webpack模块联邦

## 底层概念
我们区分本地模块和远程模块。本地模块即为普通模块，是当前构建的一部分。远程模块不属于当前构建，并在运行时从所谓的容器加载。

加载远程模块被认为是异步操作。当使用远程模块时，这些异步操作将被放置在远程模块和入口之间的下一个 `chunk` 的加载操作中。如果没有 `chunk` 加载操作，就不能使用远程模块。

容器是由容器入口创建的，该入口暴露了对特定模块的异步访问。暴露的访问分为两个步骤：
- 加载模块（异步的）
- 执行模块（同步的）

## 高级概念
每个构建都充当一个容器，也可将其他构建作为容器。通过这种方式，每个构建都能够通过从对应容器中加载模块来访问其他容器暴露出来的模块。

`packageName` 选项允许通过设置包名来查找所需的版本。默认情况下，它会自动推断模块请求，当想禁用自动推断时，请将 `requiredVersion` 设置为 `false` 。

## 例子[demo](https://github.com/Eddie-Fannie/ok-to-loose-plan/tree/main/review-webpack/module-federation)

1. 访问 localhost:8081/remoteEntry.js 即可访问app1应用的
2. app2中加载app1 exposes的模块为异步

`app1`
```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/main',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "./main_[contenthash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js', // 另外一个应用html中引入的模块联邦入口文件
      exposes: { // 选择暴露当前应用需要给外部使用的组件，供其他应用使用，注意./
        './Header': './src/header'
      },
      remotes: { // 这里关联其他应用
        app2: 'app2@http://localhost:8082/remoteEntry.js'
      },
    }),
  ],
  devServer: {
    port: 8081
  }
}

// main.js
import { render as HeaderRender } from './header';
import { render as ContentRender } from './content';

// 这种形式不会马上请求app2 remoteEntry.js 及打包后的chunk
const buttonEl = document.getElementById('button');
buttonEl.addEventListener('click', (e) => {
  import('app2/Footer').then(({ render: FooterRender }) => {
    const el = document.getElementById('root')
  
    HeaderRender(el)
    ContentRender(el);
    FooterRender(el);
  })
});

// import('app2/Footer').then(({ render: FooterRender }) => {
//   const el = document.getElementById('root')

//   HeaderRender(el)
//   ContentRender(el);
//   FooterRender(el);
// })
```
![img](/dovis-blog/other/模块联邦1.png)

:::tip
1. `shared` 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖改为使用本地项目的依赖。可以避免依赖重复打包。这里要求两个应用使用 版本号完全相同 的依赖才能被复用，否则 `Webpack` 还是会同时加载两份代码，我们可以通过 `shared.[lib].requiredVersion` 配置项显式声明应用需要的依赖库版本来解决这个问题。
2. 我们在 `Micro-Frontend-A` 中做的一个改变不会触发热重载。因此，我们在开发的时候会慢一点，我们必须在每次改变后刷新。
为了解决这个问题，模块联邦团队开发了 `@module-federation/fmr` 包。当它作为插件被包含在 `Webpack` 配置中时，你的模块联邦结构的任何变化都会自动运行 `Live Reload`。
:::

## 模块联邦的原理分析
### 前置知识 --- webpack打包原理
- `import(chunkId) => webpack_require.e(chunkId)` 将相关的请求回调存入 `installedChunks`。
- 发起 `JSONP` 请求。
- 将下载的模块录入 `modules`。
- 执行 `chunk` 请求回调。
- 加载 `module`。
- 执行用户回调。

模块联邦是基于 `webpack` 做的优化，所以在深入联邦模块之前我们首先得知道 `webpack` 是怎么做的打包工作。`webpack` 每次打包都会将资源全部包裹在一个立即执行函数里面，这样虽然避免了全局环境的污染，但也使得外部不能访问内部模块。在这个立即执行函数里面，`webpack` 使用 `webpack_modules` 对象保存所有的模块代码，然后用内部定义的 `webpack_require` 方法从 `webpack_modules` 中加载模块。并且在异步加载和文件拆分两种情况下向全局暴露一个 `webpackChunk` 数组用于沟通多个 `webpack` 资源，这个数组通过被 `webpack` 重写 `push` 方法，会在其他资源向 `webpackChunk` 数组中新增内容时同步添加到 `webpack_modules` 中从而实现模块整合。

**模块联邦就是基于这个机制，修改了 `webpack_require` 的部分实现，在 `require` 的时候从远程加载资源，缓存到全局对象 `window["webpackChunk"+appName]` 中，然后合并到 `webpack_modules` 中。**

### `ModuleFederationPlugin`原理

源码中 `ModuleFederationPlugin` 主流程 主要做了三件事：

- 通过参数是否配置 `shared` 来判断是否使用共享依赖 `SharePlugin` 模块。
- 通过参数是否配置 `exposes` 来判断是否使用公开 `ContainerPlugin` 模块。
- 通过参数是否配置 `remotes` 来判断是否使用 `ContainerReferencePlugin` 引用模块。

```js
// 源码目录 lib/container/ModuleFederationPlugin
class ModuleFederationPlugin {
  ...
  apply(compiler) {
    if (library && ...) {
      compiler.options.output.enabledLibraryTypes.push(library.type);
    }
  compiler.hooks.afterPlugins.tap("ModuleFederationPlugin", () => {
    if (options.exposes && ...) {
    new ContainerPlugin({
     ...
      }).apply(compiler);
    }
   if (options.remotes && ...) {
    new ContainerReferencePlugin({
     remoteType,
     remotes: options.remotes
      }).apply(compiler);
    }
   if (options.shared) {
    new SharePlugin({
     shared: options.shared,
     shareScope: options.shareScope
        }).apply(compiler);
      }
    });
  }
}

module.exports = ModuleFederationPlugin;
```

:::tip
`webpack5` 模块联邦对异步模块加载的处理

- 下载并执行 `remoteEntry.js`，挂载入口点对象到 `window.app-exposes`，他有两个函数属性，`init` 和 `get`。`init` 方法用于初始化作用域对象 `initScope`，`get` 方法用于下载 `moduleMap` 中导出的远程模块。
- 加载 `app-exposes` 到本地模块。
- 创建 `app-exposes.init` 的执行环境，收集依赖到共享作用域对象 `shareScope`。
- 执行 `app-exposes.init`，初始化 `initScope`。
- 用户 `import` 远程模块时调用 `app-exposes.get(moduleName)` 通过 `Jsonp` 懒加载远程模块，然后缓存在全局对象 `window['webpackChunk' + appName]`。
- 通过 `webpack_require` 读取缓存中的模块，执行用户回调。
:::