# 4. 深入浅出Webpack
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