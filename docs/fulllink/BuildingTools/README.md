# webpack学习
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