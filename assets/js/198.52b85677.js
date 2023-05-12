(window.webpackJsonp=window.webpackJsonp||[]).push([[198],{470:function(s,t,a){"use strict";a.r(t);var n=a(10),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"vue的异步更新原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vue的异步更新原理"}},[s._v("#")]),s._v(" vue的异步更新原理")]),s._v(" "),t("p",[s._v("我们把主线程执行一次的过程叫一个"),t("code",[s._v("tick")]),s._v("，所以"),t("code",[s._v("nextTick")]),s._v("就是下一个"),t("code",[s._v("tick")]),s._v("的意思，也就是说用"),t("code",[s._v("nextTick")]),s._v("的场景就是我们想在下一个"),t("code",[s._v("tick")]),s._v("做一些事的时候。")]),s._v(" "),t("blockquote",[t("p",[t("code",[s._v("nextTick")]),s._v("接收一个回调函数作为参数，它的作用是将回调延迟到下次"),t("code",[s._v("DOM")]),s._v("更新周期之后执行。在vue.js中当状态发生变化时"),t("code",[s._v("watcher")]),s._v("会得到通知，然后触发虚拟"),t("code",[s._v("DOM")]),s._v("的渲染流程。而"),t("code",[s._v("watcher")]),s._v("触发渲染这个操作并不是同步的，而是异步的。vue中有个队列，每当需要渲染时会将"),t("code",[s._v("watcher")]),s._v("推送到这个队列中，在下一次事件循环中再让"),t("code",[s._v("watcher")]),s._v("触发渲染的流程。")])]),s._v(" "),t("h2",{attrs:{id:"为什么使用异步更新队列"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#为什么使用异步更新队列"}},[s._v("#")]),s._v(" 为什么使用异步更新队列")]),s._v(" "),t("p",[s._v("vue2.0使用虚拟"),t("code",[s._v("DOM")]),s._v("进行渲染，变化侦测的通知只发送到组件，组件用到的所有状态的变化都会通知到同一个"),t("code",[s._v("watcher")]),s._v("，然后虚拟"),t("code",[s._v("DOM")]),s._v("会对整个组件进行对比"),t("code",[s._v("diff")]),s._v("并更改"),t("code",[s._v("DOM")]),s._v("。也就是说如果在同一轮事件循环中有两个数据发生变化，那么组件的"),t("code",[s._v("watcher")]),s._v("会收到两份通知，从而进行两次渲染。事实上，只需要等所有状态都修改完毕。一次性将整个组件的"),t("code",[s._v("DOM")]),s._v("渲染到最新即可。")]),s._v(" "),t("blockquote",[t("p",[s._v("要解决这个问题vue的实现方式就是将接收到通知的"),t("code",[s._v("watcher")]),s._v("实例添加到队列中缓存起来，并且在添加到队列之前检查其中是否已经存在相同的"),t("code",[s._v("watcher")]),s._v("，只有不存在时才加入队列。然后在下一次事件循环中，vue会让队列中的"),t("code",[s._v("watcher")]),s._v("触发渲染流程并清空队列。")])]),s._v(" "),t("p",[t("strong",[s._v("下次"),t("code",[s._v("DOM")]),s._v("更新周期的意思其实是下次微任务执行时更新"),t("code",[s._v("DOM")]),s._v("。而"),t("code",[s._v("vm.$nextTick")]),s._v("其实是将回调添加到微任务中。只有在特殊情况下才会降级为宏任务。")])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" callbacks "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" pending "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("flushCallbacks")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    pending "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" copies "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" callbacks"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("slice")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    callbacks"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" i"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("i"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("copies"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("i"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        copies"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" microTimerFunc\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" p "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" Promise"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolve")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function-variable function"}},[s._v("microTimerFunc")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    p"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("then")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("flushCallbacks"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("export")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("nextTick")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("cb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("ctx")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    callbacks"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("push")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("cb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("cb")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("call")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ctx"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("pending"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        pending "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("microTimerFunc")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br")])]),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("我们通过数组"),t("code",[s._v("callbacks")]),s._v("来存储用户注册的回调，声明了变量"),t("code",[s._v("pending")]),s._v("来标记是否已经向任务队列中添加任务。每当向任务队列中插入任务时，将"),t("code",[s._v("pengding")]),s._v("设置为"),t("code",[s._v("true")]),s._v("，每当任务被执行时将"),t("code",[s._v("pending")]),s._v("设置为"),t("code",[s._v("false")]),s._v("，这样就可以通过"),t("code",[s._v("pending")]),s._v("的值来判断是否需要向任务队列中添加任务。")])]),s._v(" "),t("li",[t("p",[t("code",[s._v("flushCallbacks")]),s._v("，就是我们所说的被注册的那个任务。当这个函数被触发时，会将"),t("code",[s._v("callbacks")]),s._v("中的所有函数依次执行。然后清空"),t("code",[s._v("callbacks")]),s._v("，并将"),t("code",[s._v("pending")]),s._v("设置为"),t("code",[s._v("false")]),s._v("。也就是说，一轮事件循环中"),t("code",[s._v("flushCallbacks")]),s._v("只会执行一次。")])]),s._v(" "),t("li",[t("p",[s._v("优先检测是否原生⽀持"),t("code",[s._v("Promise")]),s._v("，不⽀持的话再去检测是否⽀持"),t("code",[s._v("MutationObserver")]),s._v("，如果都不行就只能尝试宏任务实现，vue宏任务优先使用"),t("code",[s._v("setImmediate")]),s._v("（只兼容IE）。如果都不支持就使用"),t("code",[s._v("setTimeout")]),s._v("来将回调添加到宏任务队列中。")])])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 使用 mutationObserver")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" counter "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" observer "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("MutationObserver")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("flushCallbacks"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" textNode "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" document"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("createTextNode")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("String")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("counter"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nobserver"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("observe")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("textNode"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("characterData")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function-variable function"}},[s._v("timerFunc")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    counter "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("counter "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("%")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("\n    textNode"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("data "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("String")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("counter"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\nisUsingMicroTask "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br")])]),t("blockquote",[t("p",[s._v("这段代码的作用是创建一个 "),t("code",[s._v("MutationObserver")]),s._v(" 对象，通过观察一个文本节点的变化来触发回调函数 "),t("code",[s._v("flushCallbacks")]),s._v(" 。具体来说，它会创建一个文本节点，并将其添加到 "),t("code",[s._v("DOM")]),s._v(" 中。然后，"),t("code",[s._v("MutationObserver")]),s._v(" 对象会监听这个文本节点的变化，一旦发生变化就会触发 "),t("code",[s._v("flushCallbacks")]),s._v(" 回调函数。在 "),t("code",[s._v("timerFunc")]),s._v(" "),t("code",[s._v("函数中，它会修改counter")]),s._v(" 变量的值，并将新的值设置为文本节点的 "),t("code",[s._v("data")]),s._v(" 属性，从而触发 "),t("code",[s._v("MutationObserver")]),s._v(" 对象的回调函数。这样就实现了一个异步更新的效果。")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);