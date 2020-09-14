# Webpack的热更新
> 网页和`webpack-dev-server`是通过`websocket`协议互联的。当监听到文件变化的时候，会通过`websocket`通知网页调用`reload`接口刷新页面。