# vue-loader 深入浅出
## 用法
```js
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader') // v15以上版本

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin() // 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
  ]
}
```

## 总结
`Vue-loader` 是一个 `Webpack` 的 `loader` ，用于将 `Vue` 单文件组件（`.vue`文件）转换为 `JavaScript` 模块。其原理可以概括为以下几个步骤：

1. 解析单文件组件
`Vue-loader` 首先会解析 `.vue` 文件，将其分为三个部分：`<template>`、`<script>`和`<style>`。然后，它将使用相应的 `loader` 处理每个部分的内容，例如使用 `HTML-loader` 处理模板部分，使用 `Babel-loader` 处理 `JavaScript` 部分，使用 `CSS-loader` 处理样式部分。

2. 将处理后的模块组合
`Vue-loader` 将处理后的三个模块组合成一个 `JavaScript` 模块，每个模块对应于一个 `.vue` 文件。该模块可以由 `Webpack` 进一步处理，例如打包和优化。

3. 解析依赖关系
`Vue-loader` 会递归解析每个单文件组件所引用的其他组件和模块，以确定它们之间的依赖关系。这些依赖关系可以由 `Webpack` 进行打包和优化。

4. 预编译模板
`Vue-loader` 还可以使用 `Vue` 的模板编译器（Vue Template Compiler）对模板进行预编译，以提高运行时性能。预编译模板可以缓存并重复使用，从而减少每次渲染时的开销。

综上所述，`Vue-loader` 的主要作用是将 `Vue` 单文件组件转换为 `JavaScript` 模块，并将其与其他模块组合在一起，以便 `Webpack` 进一步处理和优化。`Vue-loader` 还可以预编译模板以提高性能，并解析单文件组件之间的依赖关系。

## `vue-loader` 相关问题
1. **为什么 `vue-loader` 要配合 `VueLoaderPlugin` 插件一起使用？**
>  它的职责是将你定义过的其它规则复制并应用到 `.vue` 文件里相应语言的块。例如，如果你有一条匹配 `/\.js$/` 的规则，那么它会应用到 `.vue` 文件里的 `<script>` 块。

`Vue-loader` 需要与 `VueLoaderPlugin` 插件一起使用，因为 `VueLoaderPlugin` 插件主要作用是将 `Vue-loader` 产生的一些运行时代码提取出来，以便在打包时优化生成的代码。在使用 `Vue-loader` 的过程中，会产生一些运行时的代码，比如渲染函数、静态渲染函数等。这些代码可能会被打包进最终的输出文件中，造成代码体积过大，影响性能。为了避免这种情况，需要使用 `VueLoaderPlugin` 插件来将这些运行时代码提取出来，生成独立的文件，从而减小最终的输出文件体积。除了提取运行时代码，`VueLoaderPlugin` 插件还有其他作用，例如将一些只在开发环境中使用的功能去掉，减小输出文件的体积，或者将 `Vue-loader` 的配置与 `webpack` 的配置分离，以便更好地管理配置等。因此，为了更好地使用 `Vue-loader`，需要与 `VueLoaderPlugin` 插件一起使用。这样可以优化打包后的输出文件，减小体积，提高性能。
