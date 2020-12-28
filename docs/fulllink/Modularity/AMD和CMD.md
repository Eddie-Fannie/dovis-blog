# AMD和CMD
## AMD
> `AMD （ Asynchronous Module Definition ）`，即 "异步模块定义" 。它主要采用异步方式加载模块，模块的加载不影响它后边语句的运行。所加载的模块，都会定义在回调函数中，加载完成，再执行回调函数。

## CMD
> 加载模块时可以通过同步的形式(`require`)，也可以通过异步的形式`require.async`

### 使用方式
> `AMD`利用`require.js`。通过`define`方法将代码定义为模块；通过`require`方法实现代码的模块加载。`define/require`就是`require.js`在全局注入的函数。

## AMD和CMD的区别
- `AMD` 依赖前置， js 很方便的就知道要加载的是哪个模块了，因为已经在 `define` 的`dependencies` 参数中就定义好了，会立即加载它。
- `CMD` 是就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块。只有在用到某个模块的时候再去 `require` 。
