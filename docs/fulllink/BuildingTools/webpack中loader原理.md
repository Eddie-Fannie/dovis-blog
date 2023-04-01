# `webpack` 中 `loader` 原理

## `loader` 介绍
> 每个loader本质上都是一个函数。在 `Webpack 4` 之前，函数的输入和输出都必须为字符串；在 `Webpack 4` 之后，`loader` 也同时支持抽象语法树（`AST`）的传递，通过这种方法来减少重复的代码解析。

```js
output=loader(input)
```

这里的 `input` 可能是工程源文件的字符串，也可能是上一个 `loader` 转化后的结果，包括转化后的结果（也是字符串类型）、`source map`，以及 `AST` 对象；`output` 同样包含这几种信息，转化后的文件字符串、`source map`，以及 `AST` 。如果这是最后一个 `loader` ，结果将直接被送到 `Webpack` 进行后续处理，否则将作为下一个 `loader` 的输入向后传递。

当我们串联地利用多个`loader`去转换一个文件时，每个`loader`都会链式地顺序执行。在`webpack`中，在同一文件存在多个匹配`loader`的情况下，各个`loader`的执行过程会遵循以下原则：

- `loader`的执行顺序和配置顺序是相反的，即配置的最后一个`loader`最先执行，第一个`loader`最后执行。
- 第一个执行的`loader`接收源文件的内容作为参数，其他`loader`接收前一个执行的`loader`的返回值作为参数。最后执行的`loader`会返回最终结果。

更进一步我们知道在配置`Webpack`时，可以对`loader`增加一些配置，比如著名的`babel-loader`的简单配置。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        "plugins": [
          "dynamic-import-webpack"
        ]
      }
    }
  ]
}
```

这样一来，简单的`loader`写法便不能满足需求，因为编写`loader`时，除了编写`source`内容，还需要根据开发者配置的`options`信息进行构建定制化处理，以输出最后的结果。那么如何获取`options`，这时就需要用到`loader-utils`模块。

```js
const loaderUtils = require("loader-utils")
module.exports = function(source) {
  // 获取开发者配置的options
  const options = loaderUtils.getOptions(this)
  // some magic
  return content
}
```

对于`loader`返回的内容，实际开发中，单纯对`content`进行改写并返回改写后的内容，也许是不够的。比如，我们想对`loader`处理过程中的错误进行捕获，或者想导出`sourceMap`等信息时，该如何做？比如我们想对`loader`处理过程中的错误进行捕获，或者想导出`sourceMap`等信息时，该如何做呢？这种情况需要`loader`中的`this.callback`来返回内容。`this.callback`中可以传入`4`个参数，分别：

- `error`：当`loader`出错时向外抛出一个`error`
- `content`：经过`loader`编译后需要导出的内容
- `sourceMap`：为方便调试编译后的`source map`。
- `ast`：本次编译生成的抽象语法树。之后执行的`loader`可以直接使用这个`AST`，进而省去重复生成`AST`过程。

```js
module.exports = function loader (content, map, meta) {
  var callback = this.async();
  var result = handler(content, map, meta);
  callback(
    null,           // error
    result.content, // 转换后的内容
    result.map,     // 转换后的 source-map
    result.meta,    // 转换后的 AST
  );
};
```

使用`this.callback`后，我们的`loader`代码就会变得更加复杂，同时能够处理更加多样的需求，比如：

```js
module.exports = function(source) {
  // 获取开发者配置的options
  const options = loaderUtils.getOptions(this)
  // some magic
  // return content
  this.callback(null,content)
}
```
> **当使用`this.callback`返回内容时，该`loader`必须返回`undefined`，这样`webpack`就知道该`loader`返回的结果在`this.callback`中，而不在`return`中。这里的`this`指向的是一个叫`loaderContext`的`loader-runner`特有对象**。

## 常用`loader`
- `css-loader` 的作用仅仅是处理 `CSS` 的各种加载语法（`@import`和`url()`函数等），如果要使样式起作用还需要 `style-loader` 来把样式插入页面。`css-loader` 与 `style-loader` 通常是配合在一起使用的。
- `url-loader` 与 `file-loader` 作用类似，唯一的不同在于用户可以设置一个文件大小的阈值，当大于该阈值时与 `file-loader` 一样返回`publicPath`，而小于该阈值时则返回文件 `base64` 形式编码。

:::tip
`url-loader` 和 `file-loader` 都是 `Webpack` 中用来处理文件的 `loader` ，它们的主要区别在于文件大小和处理方式。

`file-loader` 将文件复制到输出目录中，并返回相对路径，用于最终的`JS`文件中的引用。如果文件较大，它通常是首选。当使用 `file-loader` 处理文件时，文件被复制到输出目录，并生成一个 `URL` 供最终的 `JS` 文件中使用。

`url-loader` 可以将小于指定大小（默认为 `8KB` ）的文件转换为 `Base64 URL`，以减少 `HTTP` 请求的数量，从而提高页面加载性能。这对于小文件（如图标）非常有用，因为它们可以直接嵌入到最终的 `JS` 文件中。但对于大文件（会自动交给`file-loader`处理）， `url-loader` 不如 `file-loader` 的性能好。另外，`url-loader` 也可以与 `file-loader` 结合使用，以处理大文件。

需要注意的是，使用 `url-loader` 或 `file-loader` 时，需要在 `Webpack` 的配置文件中指定相应的规则，以便它们可以处理相应类型的文件。

以下是 `file-loader` 和 `url-loader` 的简单使用示例：

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
};

```
:::

## `loader` 更多配置
- `exclude` 的含义是，所有被正则匹配到的模块都排除在该规则之外，也就是说 `node_modules` 中的模块不会执行这条规则。该配置项通常是必加的，否则可能拖慢整体的打包速度。

```js
rules: [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    exclude: /node_modules/,
  }
],
```

- `include` 代表该规则只对正则匹配到的模块生效。假如我们将 `include` 设置为工程的源码目录，自然而然就将 `node_modules` 等目录排除掉了

```js
rules: [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    include: /src/,
  }
],
```

- `resource` 与 `issuer` 可用于更加精确地确定模块规则的作用范围。前面介绍的 `test` 、`exclude`、`include` 本质上属于对`resource` 也就是被加载者的配置，如果想要对 `issuer` 加载者也增加条件限制，则要额外写一些配置。

```js
rules: [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    exclude: /node_modules/,
    issuer: {
      test: /\.js$/,
      include: /src/pages/,
    },
  }
],
```

- `enforce` 用来指定一个 `loader` 的种类，只接收`“pre”`或`“post”`两种字符串类型的值。`Webpack` 中的 `loader` 按照执行顺序可分为 `pre、inline、normal、post` 四种类型，上面我们直接定义的 `loader` 都属于 `normal` 类型，`inline` 形式官方已经不推荐使用，而`pre` 和 `post` 则需要使用 `enforce` 来指定。**其 `enforce` 的值为 `“pre”`，代表它将在所有正常 `loader` 之前执行，这样可以保证其检测的代码不是被其他 `loader` 更改过的。类似的，如果某一个 `loader` 是需要在所有 `loader` 之后执行的，我们也可以指定其 `enforce` 为 `“post”`。**

:::tip
1. `exclude` 和 `include` 同时存在时，`exclude` 的优先级更高
2. 可以看到，我们添加了 `issuer` 配置对象，其形式与之前对 `resource` 条件的配置并无太大差异。但只有 `/src/pages/` 目录下面的 `JS`文件引用 `CSS` 文件，这条规则才会生效；如果不是 `JS` 文件引用的 `CSS`（比如 `JSX` 文件），或者是别的目录的 `JS` 文件引用 `CSS`，则规则不会生效。
3. 事实上，我们也可以不使用 `enforce` 而只要保证 `loader` 顺序是正确的即可。配置 `enforce` 主要的目的是使模块规则更加清晰，可读性更强，尤其是在实际工程中，配置文件可能达到上百行的情况，难以保证各个 `loader` 都按照预想的方式工作，使用 `enforce` 可以强制指定`loader` 的作用顺序。
:::

## 自定义 `loader`