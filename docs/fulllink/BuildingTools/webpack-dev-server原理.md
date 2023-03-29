# Webpack的webpack-dev-server运行原理分析
[文章来源WecTeam](https://mp.weixin.qq.com/s/p1RJDpoKdTYph_IKvbL43A)

`webpack-dev-server` 可以看作一个服务者，它的主要工作就是接收浏览器的请求，然后将资源返回。当服务启动时，它会先让 `Webpack` 进行模块打包并将资源准备好。当 `webpack-dev-server` 接收到浏览器的资源请求时，它会首先进行 `URL` 地址校验。如果该地址是资源服务地址，`webpack-dev-server` 就会从 `Webpack` 的打包结果中寻找该资源并返回给浏览器。反之，如果请求地址不属于资源服务地址，则直接读取硬盘中的源文件并将其返回。

综上我们可以总结出 `webpack-dev-server` 的两大职能。
- 令 `Webpack` 进行模块打包，并处理打包结果的资源请求。
- 作为普通的 `Web Server`，处理静态资源文件请求。

> `webpack` 将我们的项目源代码进行编译打包成可分发上线的静态资源，在开发阶段我们想要预览页面效果的话就需要启动一个服务器伺服 `webpack` 编译出来的静态资源。`webpack-dev-server `就是用来启动 `webpack` 编译、伺服这些静态资源。除此之外，它还默认提供了`liveReload`的功能，就是在一次 `webpack` 编译完成后浏览器端就能自动刷新页面读取最新的编译后资源。为了提升开发体验和效率，它还提供了 `hot` 选项开启 `hotReload`，相对于 `liveReload`, `hotReload` 不刷新整个页面，只更新被更改过的模块。

## 入口
作为命令行启动，`webpack-dev-server/bin/webpack-dev-server.js`就是整个命令行的入口。

```js
// webpack-dev-server/bin/webpack-dev-server.js

function startDevServer(config, options) {

  let compiler;

  try {
    // 2. 调用webpack函数返回的是 webpack compiler 实例
    compiler = webpack(config);
  } catch (err) {

  }

  try {
    // 3. 实例化 webpack-dev-server
    server = new Server(compiler, options, log);
  } catch (err) {

  }

  if (options.socket) {
  } else {
    // 4. 调用 server 实例的 listen 方法
    server.listen(options.port, options.host, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

// 1. 对参数进行处理后启动
processOptions(config, argv, (config, options) => {
  startDevServer(config, options);
});
```

::: tip
`webpack-dev-server` 作为命令行启动，首先是调用了 `webpack-cli` 模块下的两个文件，分别配置了命令行提示选项、和从命令行和配置文件收集了 `webpack` 的 `config`，这样复用了`webpack-cli` 的代码，保持行为一致，上面贴出来的代码省略了这部分代码，有兴趣的可以自己翻阅源码。

之后调用 `processOptions` 对收集的参数进行一些默认处理后得到需要传给 `webpack` 的 `config` 和需要传给 `webpack-dev-server` 的 `options`。传入这两个配置参数调用 `startDevServer`，`startDevServer` 这个函数主要是先调用 `webpack` 函数实例化了 `compiler`，注意这里没有给 `webpack` 函数传入回调函数，根据 `webpack` 源码实现，不传入回调函数就不会直接运行 `webpack` 而是返回 `webpack compiler` 的实例，供调用方自行启动 `webpack` 运行。拿到 `webpack compiler` 实例和先前的 `webpack-dev-server` 的 `options` 就去实例化 `Server`，这个 `Server` 类就是实现` webpack-dev-server` 的核心逻辑。

最后调用 `Server` 类的 `listen` 方法，就正式开启监听请求，`listen` 方法后面会再解析具体逻辑。这就是` webpack-dev-server `大致的启动过程，后面来看下 `Server` 类具体做了什么。
:::

> 网页和`webpack-dev-server`是通过`websocket`协议互联的。当监听到文件变化的时候，会通过`websocket`通知网页调用`reload`接口刷新页面。