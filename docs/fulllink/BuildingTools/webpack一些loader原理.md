# webpack 常见loader原理

受限于 `Node.js` 的单线程架构，原生 `Webpack` 对所有资源文件做的所有解析、转译、合并操作本质上都是在同一个线程内串行执行，`CPU` 利用率极低，因此，理所当然地社区出现了一些基于多进程方式运行 `Webpack`，或 `Webpack` 构建过程某部分工作的方案
- `HappyPack`：多进程方式运行资源加载逻辑
- `Thread-loader`：Webpack 官方出品，同样以多进程方式运行资源加载逻辑
- `TerserWebpackPlugin`：支持多进程方式执行代码压缩、`uglify` 功能
- `Parallel-Webpack`：多进程方式运行多个 `Webpack` 构建实例

> 这些方案的核心设计都很类似：针对某种计算任务创建子进程，之后将运行所需参数通过 `IPC` 传递到子进程并启动计算操作，计算完毕后子进程再将结果通过 `IPC` 传递回主进程，寄宿在主进程的组件实例再将结果提交给 Webpack。

## thread-loader
```
npm install --save-dev thread-loader
```

使用时，需将此 `loader` 放置在其他 `loader` 之前。放置在此 `loader` 之后的 `loader` 会在一个独立的 `worker` 池中运行。

在 `worker` 池中运行的 `loader` 是受到限制的。例如：

1. 这些 `loader` 不能生成新的文件。
2. 这些 `loader` 不能使用自定义的 `loader API`（也就是说，不能通过插件来自定义）。
3. 这些 `loader` 无法获取 `webpack` 的配置。
4. 每个 `worker` 都是一个独立的 `node.js` 进程，其开销大约为 `600ms` 左右。同时会限制跨进程的数据交换。

**请仅在耗时的操作中使用此 `loader` ！，如 `babel-loader`,`vue-loader`**

demo

```js
use: [
  {
    loader: "thread-loader",
    // 有同样配置的 loader 会共享一个 worker 池
    options: {
      // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
      // 在 require('os').cpus() 是 undefined 时回退至 1
      workers: 2,

      // 一个 worker 进程中并行执行工作的数量
      // 默认为 20
      workerParallelJobs: 50,

      // 额外的 node.js 参数
      workerNodeArgs: ['--max-old-space-size=1024'],

      // 允许重新生成一个僵死的 work 池
      // 这个过程会降低整体编译速度
      // 并且开发环境应该设置为 false
      poolRespawn: false,

      // 闲置时定时删除 worker 进程
      // 默认为 500（ms）
      // 可以设置为无穷大，这样在监视模式(--watch)下可以保持 worker 持续存在
      poolTimeout: 2000,

      // 池分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池的名称
      // 可以修改名称来创建其余选项都一样的池
      name: "my-pool"
    },
  },
  // 耗时的 loader（例如 babel-loader）
];
```