# Webpack的webpack-dev-server运行原理分析
[文章来源WecTeam](https://mp.weixin.qq.com/s/p1RJDpoKdTYph_IKvbL43A)

> `webpack` 将我们的项目源代码进行编译打包成可分发上线的静态资源，在开发阶段我们想要预览页面效果的话就需要启动一个服务器伺服 `webpack` 编译出来的静态资源。`webpack-dev-server `就是用来启动 `webpack` 编译、伺服这些静态资源。除此之外，它还默认提供了`liveReload`的功能，就是在一次 `webpack` 编译完成后浏览器端就能自动刷新页面读取最新的编译后资源。为了提升开发体验和效率，它还提供了 `hot` 选项开启 `hotReload`，相对于 `liveReload`, `hotReload` 不刷新整个页面，只更新被更改过的模块。

> 网页和`webpack-dev-server`是通过`websocket`协议互联的。当监听到文件变化的时候，会通过`websocket`通知网页调用`reload`接口刷新页面。