# plugin 原理
## plugin 思路
`webpack` 在运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。`Webpack` 的 `Tapable` 事件流机制保证了插件的有序性，使得整个系统扩展性良好。
- `Compiler` 对象包含了 `Webpack` 环境所有的配置信息，包含 `options`，`loaders`，`plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 `Webpack` 实例；
- `Compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建。`Compilation` 对象也提供了很多事件回调供插件做扩展。通过 `Compilation` 也能读取到 `Compiler` 对象。
- 插件需要在其原型上绑定 `apply` 方法，才能访问 `compiler` 实例
- 传给每个插件的 `compiler` 和 `compilation` 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件。
+ 找出合适的事件点去完成想要的功能：
  - `emit` 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(`emit` 事件是修改 `Webpack` 输出资源的最后时机)
  - `watch-run` 当依赖的文件发生变化时会触发
- 异步的事件需要在插件处理完任务时调用回调函数通知 `Webpack` 进入下一个流程，不然会卡住。
