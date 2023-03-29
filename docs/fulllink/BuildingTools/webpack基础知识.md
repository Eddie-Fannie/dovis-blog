# webpack 基础知识

## 配置资源入口
`Webpack` 通过 `context` 和 `entry` 这两个配置项来共同决定入口文件的路径。在配置入口时，我们实际上做了两件事。
- 确定入口模块位置，告诉 `Webpack` 从哪里开始进行打包。
- 定义 `chunk name`。如果工程只有一个入口，那么默认其 `chunk name` 为 `main` ；如果工程有多个入口，我们需要为每个入口定义 `chunk name``，来作为该chunk` 的唯一标识。

> `context` 可以理解为资源入口的路径前缀，在配置时要求必须使用绝对路径的形式。配置 `context` 的主要目的是让 `entry` 的编写更加简洁，尤其是在多入口的情况下。`context` 可以省略，默认值为当前工程的根目录。与 `context` 只能是字符串不同，`entry` 的配置可以有多种形式：**字符串、数组、对象、函数**。我们可以根据不同的需求场景来选择 `entry` 的配置类型。

```js
// 以下两种配置达到的效果相同，入口都为 <工程根路径>/src/scripts/index.js
module.exports = {
  context: path.join(__dirname, './src'),
  entry: './scripts/index.js',
};
module.exports = {
  context: path.join(__dirname, './src/scripts'),
  entry: './index.js',
};
```

:::tip
- `entry` 数组类型入口：
传入一个数组的作用是将多个资源预先合并，这样 `Webpack` 在打包时会将数组中的最后一个元素作为实际的入口路径。

```js
module.exports = {
  entry: ['babel-polyfill', './src/index.js'] ,
};

// 等同于
// webpack.config.js
module.exports = {
  entry: './src/index.js',
};

// index.js
import 'babel-polyfill';
```

- 对象类型入口：
如果想要定义多入口，则必须使用对象的形式。对象的属性名`（key）`是 `chunk name`，属性值`（value）`是入口路径
:::

## 配置资源出口
- `filename` 可以不仅仅是 `bundle` 的名字，还可以是一个相对路径，即便路径中的目录不存在也没关系，因为Webpack会在输出资源时创建该目录。
- 我们使用比较多的是 `[name]`，它与 `chunk` 是一一对应的关系，并且可读性较高。如果要控制客户端缓存，最好还要加上 `[chunkhash]`，因为每个 `chunk` 所产生的 `[chunkhash]` 只与自身内容有关，单个 `chunk` 内容的改变不会影响其他资源，可以最精确地让客户端缓存得到更新。
- `path` 用来指定资源的输出位置，`publicPath` 则用来指定资源的请求位置。

:::tip
- 输出位置：打包完成后资源产生的目录，一般将其指定为工程中的 `dist` 目录。
- 请求位置：由 `JS` 或 `CSS` 所请求的间接资源路径。页面中的资源分为两种，一种是由 `HTML` 页面直接请求的，比如通过 `script` 标签加载的 `JS` ；另一种是由 `JS` 或 `CSS` 来发起请求的间接资源，如图片、字体等（也包括异步加载的JS）。`publicPath` 的作用就是指定这部分间接资源的请求位置。

1. `HTML`相关：也就是说我们可以将 `publicPath` 指定为 `HTML` 的相对路径，在请求这些资源时，以当前页面 `HTML` 所在路径加上相对路径，构成实际请求的 `URL` 。
```js
// 假设当前HTML地址为 https://example.com/app/index.html
// 异步加载的资源名为 0.chunk.js
publicPath: "" // 实际路径https://example.com/app/0.chunk.js
publicPath: "./js" // 实际路径https://example.com/app/js/0.chunk.js
publicPath: "../assets/" // 实际路径https://example.com/aseets/0.chunk.js
```

2. `Host`相关：若 `publicPath` 的值以 `“/”` 开始，则代表此时 `publicPath` 是以当前页面的 `host name` 为基础路径的。
```js
// 假设当前HTML地址为https://example.com/app/index.html
// 异步加载的资源名为0.chunk.js
publicPath: "/" // 实际路径https://example.com/0.chunk.js
publicPath: "/js/" // 实际路径https://example.com/js/0.chunk.js
publicPath: "/dist/" // 实际路径https://example.com/dist/0.chunk.js
```

3. `CDN`相关：上面两种配置都是相对路径，我们也可以使用绝对路径的形式配置 `publicPath` 。这种情况一般在静态资源放在 `CDN` 上面，由于其域名与当前页面域名不一致，需要以绝对路径的形式进行指定时发生。当 `publicPath` 以协议头或相对协议的形式开始时，代表当前路径是 `CDN` 相关。
```js
// 假设当前页面路径为 https://example.com/app/index.html
// 异步加载的资源名为 0.chunk.js
publicPath: "http://cdn.com/" // 实际路径http://cdn.com/0.chunk.js
publicPath: "https://cdn.com/" // 实际路径https://cdn.com/0.chunk.js
publicPath: "//cdn.com/assets/" 实际路径 //cdn.com/assets/0.chunk.js
```
:::