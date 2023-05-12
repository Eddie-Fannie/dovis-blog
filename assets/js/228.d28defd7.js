(window.webpackJsonp=window.webpackJsonp||[]).push([[228],{500:function(s,t,a){"use strict";a.r(t);var n=a(10),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"模块化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#模块化"}},[s._v("#")]),s._v(" 模块化")]),s._v(" "),t("blockquote",[t("p",[s._v("模块化解决了命名冲突问题，可以提高代码的复用率，提高代码的可维护性。")])]),s._v(" "),t("ul",[t("li",[s._v("模块化好处；\n"),t("ul",[t("li",[s._v("避免命名冲突")]),s._v(" "),t("li",[s._v("更好的分离，按需加载")]),s._v(" "),t("li",[s._v("更高复用性")]),s._v(" "),t("li",[s._v("高可维护性")])])])]),s._v(" "),t("h2",{attrs:{id:"模块化方式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#模块化方式"}},[s._v("#")]),s._v(" 模块化方式")]),s._v(" "),t("ol",[t("li",[s._v("最初实现模块化方式使用函数进行封装，将不同功能的代码实现封装到不同的函数中，通常就是一个文件为一个模块，有自己的作用域，只向外暴露特定的变量和函数。"),t("strong",[s._v("这种方式容易发生命名冲突和数据不安全")])]),s._v(" "),t("li",[s._v("采取立即执行函数：立即执行函数中的匿名函数中有独立的词法作用域，避免了外界访问此作用域的变量。"),t("strong",[s._v("通过函数作用域解决了命名冲突，污染全局作用域的问题")]),s._v("，不过不能直接访问到内部的变量，是这种方式的一个弊端")])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// module.js")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("window")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" name "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'linjiaheng'")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//暴露接口来访问数据")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("a")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        console"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token template-string"}},[t("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[s._v("`")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("name:")]),t("span",{pre:!0,attrs:{class:"token interpolation"}},[t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[s._v("${")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[s._v("}")])]),t("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[s._v("`")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 暴露接口")]),s._v("\n    window"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("myModule "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" a "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("window"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script src"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"module.js"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nmyModule"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("name "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'xixi'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//无法访问")]),s._v("\nmyModule"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("foo")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// linjiaheng")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br")])]),t("ol",{attrs:{start:"3"}},[t("li",[t("code",[s._v("CommonJS")]),s._v("规范")]),s._v(" "),t("li",[t("code",[s._v("AMD和CMD")])]),s._v(" "),t("li",[t("code",[s._v("ES6")])])]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),t("ul",[t("li",[s._v("模块化发展历程\n"),t("ul",[t("li",[s._v("早期假模块化时代")])]),s._v(" "),t("blockquote",[t("p",[s._v("早期借助函数作用域来模拟模块化，称其为函数模式。这样存在命名冲突的风险。这没有从根本上解决模块的问题，只是将代码分成了更小的函数单元而已。所以有了第二种模式：利用对象，实现命名空间的概念。这样会导致数据不安全，可以被开发者修改。通过立即执行函数构造一个私有作用域，再通过闭包将需要对外暴露的数据和接口输出。")])]),s._v(" "),t("ul",[t("li",[s._v("规范标准时代："),t("code",[s._v("CommonJS/AMD/CMD/UMD")])]),s._v(" "),t("li",[s._v("ES6原生时代\n"),t("ol",[t("li",[s._v("无法使用代码分片"),t("code",[s._v("（code splitting）")]),s._v("和删除死代码"),t("code",[s._v("（tree shaking）")]),s._v("（"),t("code",[s._v("Webpack")]),s._v("的两个特别重要的特性）。")]),s._v(" "),t("li",[s._v("大多数 "),t("code",[s._v("npm")]),s._v(" 模块还是 "),t("code",[s._v("CommonJS")]),s._v(" 的形式，而浏览器并不支持其语法，因此这些包没有办法直接拿来用。")]),s._v(" "),t("li",[s._v("仍然需要考虑个别浏览器及平台的兼容性问题。")])])])])])]),s._v(" "),t("p",[s._v("随着技术的发展，"),t("code",[s._v("JavaScript")]),s._v(" 已经不仅仅用来实现简单的表单提交等功能，引入多个 "),t("code",[s._v("script")]),s._v(" 文件到页面中逐渐成为一种常态，但我们发现这种做法有很多缺点。")]),s._v(" "),t("ul",[t("li",[s._v("需要手动维护 "),t("code",[s._v("JavaScript")]),s._v(" 的加载顺序。页面的多个 "),t("code",[s._v("script")]),s._v(" 之间通常会有依赖关系，但由于这种依赖关系是隐式的，除了添加注释以外很难清晰地指明谁依赖了谁，所以当页面中加载的文件过多时很容易出现问题。")]),s._v(" "),t("li",[s._v("每一个 "),t("code",[s._v("script")]),s._v(" 标签都意味着需要向服务器请求一次静态资源，在 "),t("code",[s._v("HTTP 2")]),s._v(" 还没有出现的时期，建立连接的成本是很高的，过多的请求会严重拖慢网页的渲染速度。")]),s._v(" "),t("li",[s._v("在每个 "),t("code",[s._v("script")]),s._v(" 标签中，顶层作用域即全局作用域，没有任何处理而直接在代码中进行变量或函数声明会污染全局作用域。")])]),s._v(" "),t("p",[s._v("模块化则解决了上述所有问题。")]),s._v(" "),t("ul",[t("li",[s._v("通过导入和导出语句我们可以清晰地看到模块间的依赖关系，这点在后面会做详细的介绍。")]),s._v(" "),t("li",[s._v("模块可以借助工具来进行打包，所以在页面中只需要加载合并后的资源文件，减少了网络开销。")]),s._v(" "),t("li",[s._v("多个模块之间的作用域是隔离的，彼此不会有命名冲突。")])])]),s._v(" "),t("h2",{attrs:{id:"浏览器模块加载实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#浏览器模块加载实现"}},[s._v("#")]),s._v(" 浏览器模块加载实现")]),s._v(" "),t("ol",[t("li",[s._v("传统方法\n浏览器通过"),t("code",[s._v("script")]),s._v("标签加载脚本。这种方式会造成浏览器堵塞，所以浏览器允许脚本异步加载：")])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script src"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" defer"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script src"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v(" async"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("blockquote",[t("p",[s._v("渲染引擎遇到这命令会开始下载外部脚本，但不会等他下载和执行，而是直接执行后面的命令。")])]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),t("p",[t("code",[s._v("defer")]),s._v("等到整个页面正常渲染结束才会执行，渲染完再执行。"),t("strong",[s._v("多个"),t("code",[s._v("defer")]),s._v("脚本，会按照在页面出现的顺序加载")]),s._v(" "),t("code",[s._v("async")]),s._v("一旦下载完成，渲染引擎就会中断渲染，执行这个脚本之后再继续渲染。下载完就执行。"),t("strong",[s._v("不能保证加载顺序")])])]),s._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[s._v("浏览器加载ES6模块时，要在"),t("code",[s._v("script")]),s._v("标签中加入"),t("code",[s._v("type='module'")]),s._v("。浏览器都是异步加载了，不会堵塞浏览器。等到整个页面渲染完再执行模块脚本，等同于添加了"),t("code",[s._v("defer")]),s._v("属性。"),t("code",[s._v("async")]),s._v("属性也可以在ES6中添加使用。")])]),s._v(" "),t("h2",{attrs:{id:"es6和commonjs模块的差异"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#es6和commonjs模块的差异"}},[s._v("#")]),s._v(" ES6和CommonJS模块的差异")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("CommonJS")]),s._v(" 模块导出的是一个值的拷贝，"),t("code",[s._v("ES6")]),s._v(" 模块输出的是值的引用。")]),s._v(" "),t("li",[t("code",[s._v("CommonJS")]),s._v(" 模块是运行时加载，"),t("code",[s._v("ES6")]),s._v(" 模块是编译时输出接口")])]),s._v(" "),t("blockquote",[t("p",[s._v("第二个差异是因为 "),t("code",[s._v("CommonJS")]),s._v(" 加载的是一个对象（"),t("code",[s._v("module.exports")]),s._v("）该对象只有在脚本运行结束时才会生成。而 "),t("code",[s._v("ES6")]),s._v(" 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。")]),s._v(" "),t("p",[s._v("第一个差异：值的复制，也就是说一旦输出一个值，模块内部的变化就不会影响到这个值，"),t("code",[s._v("CommonJS")]),s._v(" 会产生缓存。"),t("code",[s._v("ES6")]),s._v(" 的运行机制却不同，表现在遇到模块加载命令"),t("code",[s._v("import")]),s._v("就会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。"),t("strong",[s._v("ES6模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块")]),s._v("，由于ES6的输入的模块变量只是一个符号连接，所以这个变量为只读，对它重新赋值就会报错，类似定义了一个"),t("code",[s._v("const")]),s._v("变量。")])]),s._v(" "),t("blockquote",[t("p",[t("code",[s._v("CommonJS")]),s._v(" 和 "),t("code",[s._v("ES6 Module")]),s._v(" 是目前使用较为广泛的模块标准。它们的主要区别在于前者是在运行时建立模块依赖关系，后者是在编译时建立；在模块导入方面，"),t("code",[s._v("CommonJS")]),s._v(" 导入的是值副本，"),t("code",[s._v("ES6 Module")]),s._v(" 导入的是只读的变量映射；"),t("code",[s._v("ES6Module")]),s._v(" 通过其静态特性可以进行编译过程中的优化，并且具备处理循环依赖的能力。")])])])}),[],!1,null,null,null);t.default=e.exports}}]);