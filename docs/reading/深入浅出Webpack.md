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

#### 5.4.1 Compiler和Compilation
> 在开发`Plugin`时最常用的两个对象就是`Compiler`和`Compilation`，它们是`Plugin`和`Webpack`之间的桥梁。

::: tip
`Compiler`对象包含了`Webpack`环境的所有配置信息，包含`options`、`loaders`、`plugins`等信息。这个对象在 `Webpack` 启动时被实例化，它是全局唯一的，可以简单地将它理解为`Webpack`实例。

`Compilation`对象包含了当前的模块资源、编译生成资源、变化的文件等。当`Webpack`以开发模式运行时，每当检测到一个文件发生变化，便有一次新的`Compilation`被创建。`Compilation`对象也提供了很多事件回调供插件进行扩展。通过`Compilation`也能读取到`Compiler`对象。

`Compiler`和`Compilation`的区别在于：`Compiler`代表了整个`Webpack`从启动到关闭的生命周期，而`Compilation`只代表一次新的编译。
:::

#### 5.4.2事件流
> `Webpack`就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。这条生产线上的每个处理流程的职责都是单一的，多个流程之间存在依赖关系，只有在完成当前处理后才能提交给下一个流程去处理。插件就像插入生产线中的某个功能，在特定的时机对生产线上的资源进行处理。

`Webpack`通过`Tapable`来组织这条生产线。**`Webpack`在运行的过程中会广播事件，插件只需要监听它所关心的事件，就能加入这条生产线中，去改变生产线的运作。`Webpack`的事件流机制保证了插件的有序性，使得整个系统的扩展性良好。**

`Webpack`的事件流机制应用了观察者模式，和Node.js中的`EventEmitter`非常相似。`Compiler`和`Compilation`都继承自`Tapable`，可以直接在`Compiler`和`Compilation`对象上广播和监听事件。