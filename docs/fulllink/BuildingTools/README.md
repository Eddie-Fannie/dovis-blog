# webpack学习

## webpack 运行机制
`webpack` 运行流程简图

![img](/dovis-blog/webpack/1.png)

`webpack`会在各个生命周期中广播事件，插件坚挺到对应的事件便会触发
![img](/dovis-blog/webpack/2.png)


## `plugin`
> 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括打包优化，资源管理，注入环境变量。想要使用一个插件，只需要`require()`它，然后把它添加到`plugins`数组中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

## `loader`
:::tip
从定义和职责来看，loader的实现很像一个纯函数，输入一个文件，输出转换后的内容给下一个loader或者交给webpack处理

那么 `loader` 是一个纯函数吗？
`Loader` 不是纯函数，主要有两个原因：
1. `loader` 有执行上下文（context)，也就是通过`this`访问内置的属性和方法，以实现特定的功能
2. `loader`的return语句不一定有返回
:::

`loader`分为四类：前置`Pre`、普通`Normal`、后置`Post`、行内`Inline`。可在配置文件中通过`rule.enforce`属性指定`loader`的类型；类型也会影响`loader`的执行顺序。