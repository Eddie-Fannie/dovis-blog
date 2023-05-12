(window.webpackJsonp=window.webpackJsonp||[]).push([[239],{511:function(e,t,a){"use strict";a.r(t);var s=a(10),v=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"🦐皮项目总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#🦐皮项目总结"}},[e._v("#")]),e._v(" 🦐皮项目总结")]),e._v(" "),t("h2",{attrs:{id:"zone电子围栏"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#zone电子围栏"}},[e._v("#")]),e._v(" zone电子围栏")]),e._v(" "),t("p",[e._v("难点模块："),t("code",[e._v("undo")]),e._v("、"),t("code",[e._v("redo")]),e._v("，精准的吸附、贴边的处理、边界的切割、"),t("code",[e._v("split")]),e._v("、"),t("code",[e._v("merge")]),e._v("、绘制")]),e._v(" "),t("p",[e._v("整体结构 -- 主要功能模块与初始化\n"),t("code",[e._v("DrawingManger")]),e._v("：管理绘制、编辑、删除一个或多个zone多边形的状态、方法\n"),t("code",[e._v("EventManager")]),e._v("：管理所有地图、及地图中图形的监听事件\n"),t("code",[e._v("ActionLogManager")]),e._v("： 管理所有Zone绘制过程中的操作记录Log，及相关数据的统一处理\n"),t("code",[e._v("UndoRedoManager")]),e._v("：管理UndoRedo操作涉及的状态、方法")]),e._v(" "),t("h3",{attrs:{id:"蒙层与可编辑区域"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#蒙层与可编辑区域"}},[e._v("#")]),e._v(" 蒙层与可编辑区域")]),e._v(" "),t("p",[e._v("解决方案：")]),e._v(" "),t("ol",[t("li",[e._v("限制地图的最小缩放级别、避免用户看到蒙层边缘")]),e._v(" "),t("li",[e._v("监听地图的"),t("code",[e._v("dragend")]),e._v("事件，将可视区域控制在画Zone的有效区域附近")]),e._v(" "),t("li",[e._v("利用了"),t("code",[e._v("GeoJSON")]),e._v("中有孔的"),t("code",[e._v("Polygon")]),e._v("作为蒙层，孔的区域作为画"),t("code",[e._v("Zone")]),e._v("的有效区域")])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("ol",[t("li",[e._v("有孔"),t("code",[e._v("polygon")]),e._v("：")])]),e._v(" "),t("ul",[t("li",[e._v("内部有多边形孔的"),t("code",[e._v("Polygon")]),e._v("多边形，第二个数组所描述的就是多边形内孔")]),e._v(" "),t("li",[e._v("作为孔的多边形，孔各点的坐标需按逆时针顺序，如何判断是否为顺时针方法"),t("a",{attrs:{href:"https://github1s.com/Turfjs/turf/blob/625b4205dfd39687cf622ca565109c60bc8aaeb5/packages/turf-boolean-clockwise/index.ts",target:"_blank",rel:"noopener noreferrer"}},[e._v("turf.js"),t("OutboundLink")],1)])]),e._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[e._v("使用一个比东南亚还要大的"),t("code",[e._v("polygon")]),e._v(" "),t("code",[e._v("geojson")]),e._v(" 数据")])]),e._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"type"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Polygon"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token string-property property"}},[e._v('"coordinates"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("69.2578125")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("43.19716728250127")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("179.421875")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("43.19716728250127")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("179.421875")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("29.84064389983441")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("69.2578125")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("29.84064389983441")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("69.2578125")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[e._v("43.19716728250127")]),e._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br"),t("span",{staticClass:"line-number"},[e._v("8")]),t("br"),t("span",{staticClass:"line-number"},[e._v("9")]),t("br"),t("span",{staticClass:"line-number"},[e._v("10")]),t("br"),t("span",{staticClass:"line-number"},[e._v("11")]),t("br"),t("span",{staticClass:"line-number"},[e._v("12")]),t("br"),t("span",{staticClass:"line-number"},[e._v("13")]),t("br"),t("span",{staticClass:"line-number"},[e._v("14")]),t("br"),t("span",{staticClass:"line-number"},[e._v("15")]),t("br"),t("span",{staticClass:"line-number"},[e._v("16")]),t("br"),t("span",{staticClass:"line-number"},[e._v("17")]),t("br"),t("span",{staticClass:"line-number"},[e._v("18")]),t("br"),t("span",{staticClass:"line-number"},[e._v("19")]),t("br"),t("span",{staticClass:"line-number"},[e._v("20")]),t("br"),t("span",{staticClass:"line-number"},[e._v("21")]),t("br"),t("span",{staticClass:"line-number"},[e._v("22")]),t("br"),t("span",{staticClass:"line-number"},[e._v("23")]),t("br"),t("span",{staticClass:"line-number"},[e._v("24")]),t("br"),t("span",{staticClass:"line-number"},[e._v("25")]),t("br"),t("span",{staticClass:"line-number"},[e._v("26")]),t("br"),t("span",{staticClass:"line-number"},[e._v("27")]),t("br")])])]),e._v(" "),t("h3",{attrs:{id:"绘图"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#绘图"}},[e._v("#")]),e._v(" 绘图")]),e._v(" "),t("p",[e._v("使用"),t("code",[e._v("google map")]),e._v("提供的"),t("code",[e._v("Drawing Tools")]),e._v("封装了一个图形绘制的整体过程，只暴露了绘制完成的事件。而电子围栏模块的需求中，对于图形绘制的过程中，每次的落点都有交互和处理的逻辑，所以没法应用")]),e._v(" "),t("h4",{attrs:{id:"一些细节"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一些细节"}},[e._v("#")]),e._v(" 一些细节")]),e._v(" "),t("ol",[t("li",[e._v("如何判断 "),t("code",[e._v("polygon")]),e._v(" 不自相交 ("),t("a",{attrs:{href:"https://turfjs.fenxianglu.cn/category/misc/kinks.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("turf/kinks"),t("OutboundLink")],1),e._v(")，"),t("code",[e._v("zone")]),e._v("交给后台切割返回，"),t("code",[e._v("unit")]),e._v("提示自相交")]),e._v(" "),t("li",[e._v("绘制过程 "),t("code",[e._v("polygon")]),e._v(" 互相相交会自动切割，"),t("code",[e._v("zone")]),e._v("中交给后台处理，"),t("code",[e._v("unit")]),e._v("中sdk处理")]),e._v(" "),t("li",[e._v("绘制时会自动进行多边形吸附，支持业务传入 "),t("code",[e._v("snap")]),e._v("进行配置")]),e._v(" "),t("li",[e._v("绘制完成后计算面积 "),t("a",{attrs:{href:"https://turfjs.fenxianglu.cn/category/measurement/area.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("turf/area"),t("OutboundLink")],1),e._v("，"),t("code",[e._v("zone")]),e._v("让后台处理")]),e._v(" "),t("li",[e._v("拖动多边形点可以更新多边形，之前使用 "),t("code",[e._v("google map")]),e._v(" 可以删掉多边形上的点")]),e._v(" "),t("li",[e._v("合并多边形可以看看 "),t("a",{attrs:{href:"https://turfjs.fenxianglu.cn/category/transformation/union.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("turf/union"),t("OutboundLink")],1),e._v("，业务使用接口来处理")]),e._v(" "),t("li",[t("code",[e._v("split")]),e._v(" 分割多边形")]),e._v(" "),t("li",[t("code",[e._v("undo, redo")])])]),e._v(" "),t("h4",{attrs:{id:"可以删除线上的点-更新多边形"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#可以删除线上的点-更新多边形"}},[e._v("#")]),e._v(" 可以删除线上的点，更新多边形")]),e._v(" "),t("h4",{attrs:{id:"split-zone"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#split-zone"}},[e._v("#")]),e._v(" Split zone")]),e._v(" "),t("p",[e._v("对比引线只能在边上，跟超出zone边界的两种交互的实现")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("遍历zone图形所有点，以split线的点为分界线，将两侧点分别加入到两个新的zone图形中，并通过坐标点旋转以避免多边形出现孔的情况")]),e._v("。")])]),e._v(" "),t("ol",[t("li",[e._v("使用 "),t("code",[e._v("new google.maps.Polyline")]),e._v(" 创建一条分割线")])]),e._v(" "),t("h4",{attrs:{id:"add-zone"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#add-zone"}},[e._v("#")]),e._v(" Add Zone")]),e._v(" "),t("h4",{attrs:{id:"初始"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#初始"}},[e._v("#")]),e._v(" 初始")]),e._v(" "),t("p",[e._v("初始化Polyline和Polygon，绘制过程中，更新Zone的Polyline以及Polygon的数据，渲染更新的Polyline到地图。绘制完成时，渲染Zone的Polygon到地图。")]),e._v(" "),t("p",[e._v("各初始化的任务：")]),e._v(" "),t("ol",[t("li",[e._v("初始化DrawingManager，创建新的Zone轨迹的PolyLine和Zone图形的Polygon对象")]),e._v(" "),t("li",[e._v("初始化UndoRedoManager，准备后续记录用户的绘图操作")]),e._v(" "),t("li",[e._v("初始化各个Add过程中的交互功能的事件注册。包括：\na. 落点时，更新Zone的轨迹线Polyline\nb. 鼠标移动时，渲染引线，提示框\nc. 鼠标移动时，寻找，计算和显示自动吸附点\nd. 鼠标移入移出有效区域时的处理\ne. 鼠标双击时，完成Zone的闭合和绘制\nf. drag/drop现有的点时，更新该点的位置\ng. 右键点击现有的点时，提供可以删除该点的选项")])]),e._v(" "),t("h5",{attrs:{id:"边的自动吸附"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#边的自动吸附"}},[e._v("#")]),e._v(" 边的自动吸附")]),e._v(" "),t("ol",[t("li",[e._v("add操作过程中，始终有引线跟随，当引线接近绘制区域边界、或是其他zone的边界时，会自动吸附到该边上。")]),e._v(" "),t("li",[e._v("通过Map API提供的"),t("code",[e._v("isLocationOnEdge")]),e._v("方法")]),e._v(" "),t("li",[e._v("但是这个无法保证精确度，提供点buffer")]),e._v(" "),t("li",[e._v("找到buffer内的点后，通过几何计算，找到临近的边上距离目标点最新的点（涉及"),t("strong",[e._v("墨卡托坐标系转换")]),e._v("）")])]),e._v(" "),t("h4",{attrs:{id:"切边处理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#切边处理"}},[e._v("#")]),e._v(" 切边处理")]),e._v(" "),t("p",[e._v("绘制完成后提交数据，后端对提交的polygon数据与服务范围边界进行计算，去掉边界外的部分")]),e._v(" "),t("h4",{attrs:{id:"merge-zone"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#merge-zone"}},[e._v("#")]),e._v(" merge zone")]),e._v(" "),t("p",[e._v("现有方案交给后台处理")]),e._v(" "),t("h2",{attrs:{id:"webpack-构建优化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack-构建优化"}},[e._v("#")]),e._v(" webpack 构建优化")]),e._v(" "),t("ul",[t("li",[e._v("开发构建时会编译所有页面，但是开发可能只关注若干页面")]),e._v(" "),t("li",[e._v("缺少编译缓存")]),e._v(" "),t("li",[e._v("单线程")])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("p",[t("code",[e._v("webpack")]),e._v("从v4升级到v5，由于升级了 "),t("code",[e._v("webpack")]),e._v("，"),t("code",[e._v("webpack-cli")]),e._v("，"),t("code",[e._v("plugin")]),e._v(" 以及 "),t("code",[e._v("loader")]),e._v(" 的版本，因此，可能会出现新的错误或警告。在编译过程中请注意是否有弃用警告。")]),e._v(" "),t("p",[e._v("你可以通过如下方式调用 "),t("code",[e._v("webpack")]),e._v(" 来获取堆栈信息中的弃用警告，从而找出是哪个 "),t("code",[e._v("plugin")]),e._v(" 或 "),t("code",[e._v("loader")]),e._v(" 造成的。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("node --trace-deprecation node_modules/webpack/bin/webpack.js\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br")])])]),e._v(" "),t("h3",{attrs:{id:"thread-loader插件-多线程构建"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#thread-loader插件-多线程构建"}},[e._v("#")]),e._v(" "),t("code",[e._v("thread-loader")]),e._v("插件，多线程构建")]),e._v(" "),t("p",[e._v("线程池线程数量，现代计算机一般有多个核，主线程占一个核，剩下的核我们把大约一半分给 "),t("code",[e._v("vue")]),e._v(" 模块，剩余分给 "),t("code",[e._v("js")]),e._v(" 模块，\n假设计算机核数为 "),t("code",[e._v("cpuCount")]),e._v(" ，")]),e._v(" "),t("ul",[t("li",[e._v("在 "),t("code",[e._v("vue")]),e._v(" 模块配置中，"),t("code",[e._v("workersForVue = Math.max(1, Math.floor((cpuCount - 1)/2 - 1))")])]),e._v(" "),t("li",[e._v("在 "),t("code",[e._v("js")]),e._v(" 模块配置中，"),t("code",[e._v("workersForJs = Math.max(1, cpuCount - workersForVue)")])])]),e._v(" "),t("h3",{attrs:{id:"cache-loader-增加编译缓存"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cache-loader-增加编译缓存"}},[e._v("#")]),e._v(" "),t("code",[e._v("cache-loader")]),e._v("，增加编译缓存")]),e._v(" "),t("blockquote",[t("p",[e._v("安装 "),t("code",[e._v("cache-loader")]),e._v(" ，在开发环境配置里的 "),t("code",[e._v("vue-loader")]),e._v(" 和 "),t("code",[e._v("babel-loader")]),e._v(" 加上缓存相关配置项")])]),e._v(" "),t("p",[e._v("配置项")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("loader")]),e._v(" "),t("th",[e._v("options")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("vue-loader")]),e._v(" "),t("td",[e._v("{ cacheDirectory: "),t("code",[e._v("node_modules/.cache-${userName}/vue-loader")]),e._v(", "),t("br"),e._v(" cacheIdentifier: getCacheIdentifier(envIndentifier, ['cache-loader', 'vue-loader']), }")])]),e._v(" "),t("tr",[t("td",[e._v("babel-loader")]),e._v(" "),t("td",[e._v("{ cacheDirectory: "),t("code",[e._v("node_modules/.cache-${userName}/babel-loader")]),e._v(", "),t("br"),e._v(" cacheIdentifier: getCacheIdentifier(envIndentifier, ['cache-loader', 'babel-loader', 'acribus', 'acribus-core']), }")])])])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("ol",[t("li",[t("code",[e._v("userName")]),e._v(" 为当前用户名，开发过程可能使用 "),t("code",[e._v("sudo")]),e._v("进行构建，不同用户使用不同缓存目录，"),t("code",[e._v("sudo")]),e._v("下"),t("code",[e._v("userName")]),e._v("为"),t("code",[e._v("root")]),e._v("。")])]),e._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" os "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("'os'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" userName "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" os"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("userInfo")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("username"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br")])]),t("ol",{attrs:{start:"2"}},[t("li",[t("code",[e._v("getCacheIdentifier")]),e._v(" 是生成缓存标识（"),t("code",[e._v("cacheIdentifier")]),e._v("）的函数，缓存标识用于与单个文件的修改时间一起生成该文件的缓存标识。\n代码参考："),t("a",{attrs:{href:"https://github.com/facebook/create-react-app/blob/bb64e31a81eb12d688c14713dce812143688750a/packages/react-dev-utils/getCacheIdentifier.js",target:"_blank",rel:"noopener noreferrer"}},[e._v("create-react-app/packages/react-dev-utils"),t("OutboundLink")],1)]),e._v(" "),t("li",[t("code",[e._v("envIndentifier")]),e._v(" 为环境变量标识，当环境变量变更的时候，缓存应该失效，所以缓存标识与环境变量相关。")])]),e._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" envIndentifier "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token template-string"}},[t("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[e._v("`")]),t("span",{pre:!0,attrs:{class:"token interpolation"}},[t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("${")]),t("span",{pre:!0,attrs:{class:"token constant"}},[e._v("FTE")]),t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("}")])]),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("-")]),t("span",{pre:!0,attrs:{class:"token interpolation"}},[t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("${")]),t("span",{pre:!0,attrs:{class:"token constant"}},[e._v("ENV")]),t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("}")])]),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("-")]),t("span",{pre:!0,attrs:{class:"token interpolation"}},[t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("${")]),e._v("mode"),t("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("}")])]),t("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[e._v("`")])]),e._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// FTE 环境变量 表示当前构建环境，test/uat/staging...,ENV 环境变量表示当前哪个市场，id/th/my/ph/tw/br... mode构建模式（development)")]),e._v("\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br")])])]),e._v(" "),t("h3",{attrs:{id:"升级到-webpack5-利用-webpack5的模块联邦-module-federation-功能-进行模块拆分-让模块独立编译和维护"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#升级到-webpack5-利用-webpack5的模块联邦-module-federation-功能-进行模块拆分-让模块独立编译和维护"}},[e._v("#")]),e._v(" 升级到 "),t("code",[e._v("webpack5")]),e._v("，利用 "),t("code",[e._v("webpack5")]),e._v("的模块联邦 （"),t("code",[e._v("module federation")]),e._v("）功能，进行模块拆分，让模块独立编译和维护")]),e._v(" "),t("ol",[t("li",[e._v("提升开发体验")]),e._v(" "),t("li",[e._v("满足部分业务独立维护和发布的需求")]),e._v(" "),t("li",[e._v("降低项目复杂度，减少迭代成本")])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("ul",[t("li",[e._v("共享NPM包设计")])]),e._v(" "),t("blockquote",[t("p",[e._v("由于每个子应用都有自己的 "),t("code",[e._v("package.json")]),e._v("，包含自己用到的 "),t("code",[e._v("npm")]),e._v(" 包，不同的子应用可能会用到同一个包，例如 "),t("code",[e._v("vue")]),e._v(", "),t("code",[e._v("vue-router")]),e._v(" 和 "),t("code",[e._v("lodash")]),e._v(" 等，在子应用开发过程中，可能会升级某个包，导致不同的子应用该包的版本不一致，如果那个包是支持多实例或者没有全局副作用的，多版本是没有问题的，否则就会产生冲突。")])]),e._v(" "),t("p",[e._v("如何避免冲突：")]),e._v(" "),t("ul",[t("li",[e._v("把共享的 "),t("code",[e._v("npm")]),e._v(" 包放主应用，升级时通过修改主应用来完成升级，把主应用 "),t("code",[e._v("package.json")]),e._v(" 里列出来的所有依赖都配置成共享")]),e._v(" "),t("li",[e._v("通过配置，确保共享的 "),t("code",[e._v("npm")]),e._v(" 包在运行时只会存在一个版本 "),t("code",[e._v("webpack module federation")]),e._v(" 里的 "),t("code",[e._v("singleton")]),e._v(" 配置可以让某个共享包在运行时只会加载一个，并且是最高版本的那个。(版本一样，按package.json内的name字段来比较)")]),e._v(" "),t("li",[e._v("在运行时检查 "),t("code",[e._v("npm")]),e._v(" 包版本，确保主应用里的版本比子应用里的版本高，和提示被不同子应用用到但是没有共享的包")])]),e._v(" "),t("ul",[t("li",[e._v("加载子模块应该不阻塞主应用的启动，子模块的代码应该通过异步的方式加载。即通过手动加入标签的方式，异步加载 "),t("code",[e._v("remoteEntry.js")])])])]),e._v(" "),t("h2",{attrs:{id:"webpack打包优化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack打包优化"}},[e._v("#")]),e._v(" webpack打包优化")]),e._v(" "),t("h3",{attrs:{id:"fms打包效率优化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#fms打包效率优化"}},[e._v("#")]),e._v(" fms打包效率优化")]),e._v(" "),t("ol",[t("li",[e._v("分析包体积：打包时间112s，大小20.81MB")]),e._v(" "),t("li",[e._v("部分包体积大的引入"),t("code",[e._v("cdn")])])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("ul",[t("li",[e._v("干掉 "),t("code",[e._v("element-ui")]),e._v("，包大小变为20.23MB")]),e._v(" "),t("li",[t("code",[e._v("vue,vuex,vue-router")]),e._v(" vue全家桶接入cdn后，大小为20.12MB")]),e._v(" "),t("li",[t("code",[e._v("echarts")]),e._v("接入cdn后，体积变为19.72MB")]),e._v(" "),t("li",[t("code",[e._v("xlsx.js")]),e._v("：升级版本，由0.17.x升级到0.18.x（支持tree-shaking`）。全量加载改成按需加载。打包时间变为80.7s，大小19.23MB")]),e._v(" "),t("li",[e._v("翻译资源JSON文件改成使用 tsp")]),e._v(" "),t("li",[e._v("acribus改成异步加载")])])]),e._v(" "),t("ol",{attrs:{start:"3"}},[t("li",[e._v("通过"),t("code",[e._v("SplitChunk.maxSize")]),e._v("将超过制定大小的包再进行拆分，配合"),t("code",[e._v("http2")]),e._v("多路复用特性效果更好")]),e._v(" "),t("li",[e._v("因为acribus及代码循环历史原因，没有使用"),t("code",[e._v("esbuild-loader")]),e._v("代替"),t("code",[e._v("babel-loader")]),e._v("，只使用"),t("code",[e._v("ESBuildMinifyPlugin")]),e._v("压缩"),t("code",[e._v("js/css")]),e._v("，提升不少速度")])]),e._v(" "),t("h3",{attrs:{id:"提升打包效率"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#提升打包效率"}},[e._v("#")]),e._v(" 提升打包效率")]),e._v(" "),t("ol",[t("li",[e._v("使用"),t("code",[e._v("speed-measure-webpack-plugin")]),e._v("分析启动耗时")]),e._v(" "),t("li",[e._v("引入懒编译"),t("code",[e._v("lazyCompilation")]),e._v("，只针对"),t("code",[e._v("views")]),e._v("文件进行懒编译。（跳转路由时触发增量编译）")])]),e._v(" "),t("blockquote",[t("p",[e._v("引入"),t("code",[e._v("webpack")]),e._v("的懒编译，首次启动的时间(55.48s）降为之前的47%左右（现在26.64s），提升了53%的效率。首次进入页面耗（打开本地spx）时再次编译耗时1.8s，跳转路由再次触发编译耗费2.64s的时间。整体的效果相比优化前有明显的提升。但是由于每次进入新的页面都会触发编译，导致体验感稍微降低。")])]),e._v(" "),t("ol",{attrs:{start:"3"}},[t("li",[e._v("减少不必要的压缩，启动时间降为22.001s，减少4.63s")])]),e._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("optimization")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("minimize")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[e._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br")])]),t("ol",{attrs:{start:"4"}},[t("li",[e._v("增加缓存方案，首次启动性能有所下降，首次启动时间上升到27.43s，二次启动启动时间为24.19s")])]),e._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("cache")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("type")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("'filesystem'")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br")])]),t("h2",{attrs:{id:"fms-lcp优化专项"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#fms-lcp优化专项"}},[e._v("#")]),e._v(" fms LCP优化专项")]),e._v(" "),t("p",[e._v("LCP(largest contentful paint)，从7s到3s。从devtools -> performance insights可以看到")]),e._v(" "),t("p",[t("img",{attrs:{src:"/dovis-blog/other/88.png",alt:"img"}})]),e._v(" "),t("h3",{attrs:{id:"优化措施"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#优化措施"}},[e._v("#")]),e._v(" 优化措施")]),e._v(" "),t("p",[e._v("开发模式下")]),e._v(" "),t("ol",[t("li",[e._v("把所有必须的数据请求到 "),t("code",[e._v("index.html")]),e._v(" 页面执行。")])]),e._v(" "),t("ul",[t("li",[e._v("子应用 "),t("code",[e._v("remoteEntry")]),e._v(" 添加到 "),t("code",[e._v("preload")]),e._v(" 。前置到 "),t("code",[e._v("html")]),e._v(" 中加载")]),e._v(" "),t("li",[e._v("ajax请求 放到 index.html")])]),e._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[t("p",[e._v("懒加载 acribus shcema")])]),e._v(" "),t("li",[t("p",[e._v("fms-admin使用vue基础组件库CDN")])])]),e._v(" "),t("blockquote",[t("p",[e._v("首屏加载存在一个阶段，并行加载了大量"),t("code",[e._v("js chunk")]),e._v("，而其中属于"),t("code",[e._v("vue")]),e._v("基础组件库的"),t("code",[e._v("chunk数")]),e._v("量较多。此外，在主应用和子应用中也存在重复引入相同组件的情况。通过将"),t("code",[e._v("vue")]),e._v("基础组件库部署到"),t("code",[e._v("cdn")]),e._v("，在"),t("code",[e._v("fms-admin")]),e._v("统一使用"),t("code",[e._v("cdn")]),e._v("的组件库资源，则可以缓解这些问题。")])]),e._v(" "),t("ol",{attrs:{start:"4"}},[t("li",[t("strong",[e._v("对各初始化API增加IndexDB的缓存")])]),e._v(" "),t("li",[t("code",[e._v("cdn")]),e._v("缓存时间从十分钟改为7天")])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("p",[e._v("优化前主应用chunk 数量121个，子应用部分58个。优化后主应用chunk数83个，子应用46个。")])]),e._v(" "),t("h2",{attrs:{id:"admin微前端加载优化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#admin微前端加载优化"}},[e._v("#")]),e._v(" "),t("code",[e._v("Admin")]),e._v("微前端加载优化")]),e._v(" "),t("h3",{attrs:{id:"背景"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#背景"}},[e._v("#")]),e._v(" 背景")]),e._v(" "),t("p",[e._v("使用 "),t("code",[e._v("Module federation")]),e._v(" 拆分之后，由于需要异步加载子应用远程入口（"),t("code",[e._v("remote entry")]),e._v("）和资源，页面 "),t("code",[e._v("LCP")]),e._v(" 可能会增大，过程大概如下：")]),e._v(" "),t("ol",[t("li",[e._v("应用入口被加载")]),e._v(" "),t("li",[e._v("子应用的 "),t("code",[e._v("remote entry")]),e._v(" 并行加载")]),e._v(" "),t("li",[e._v("子应用资源并行加载")]),e._v(" "),t("li",[e._v("页面显示")])]),e._v(" "),t("p",[e._v("这几个步骤是串行的，会阻塞页面的渲染。要想减少 "),t("code",[e._v("LCP")]),e._v("，主要有两方面的优化：")]),e._v(" "),t("ul",[t("li",[e._v("加快 "),t("code",[e._v("remote entry")]),e._v(" 加载")]),e._v(" "),t("li",[e._v("减少子应用资源的加载和注册对渲染的阻塞")])]),e._v(" "),t("h3",{attrs:{id:"对remoteentry的缓存控制"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#对remoteentry的缓存控制"}},[e._v("#")]),e._v(" 对"),t("code",[e._v("remoteEntry")]),e._v("的缓存控制")]),e._v(" "),t("ul",[t("li",[e._v("不缓存\n通常来说，"),t("code",[e._v("remote entry")]),e._v(" 是不能使用强缓存的，因为在子应用发布后其他应用需要加载到最新的 "),t("code",[e._v("remote entry")]),e._v(" 才能正确的使用最新发布的子应用的功能。\n所以在一开始的时候我们通过在加载 "),t("code",[e._v("remote entry")]),e._v(" 的时候在 "),t("code",[e._v("url")]),e._v(" 上添加时间戳来保证每次加载到的 "),t("code",[e._v("remote entry")]),e._v(" 都是最新的，这种方式存在两个问题：")])]),e._v(" "),t("ol",[t("li",[e._v("没有缓存，加载时间长")]),e._v(" "),t("li",[e._v("当某个应用被多个其他应用依赖时，由于带时间戳的 "),t("code",[e._v("URL")]),e._v(" 不同，会导致一个 "),t("code",[e._v("remote entry")]),e._v(" 被加载多次（多个运行时）从而引起问题")])]),e._v(" "),t("ul",[t("li",[e._v("协商缓存 + "),t("code",[e._v("preload")]),e._v("\n为了解决面提到的问题，我们把 "),t("code",[e._v("remote entry")]),e._v(" 改成了协商缓存。使用协商缓存之后，每个子应用的 "),t("code",[e._v("remote entry")]),e._v(" 的加载 "),t("code",[e._v("URL")]),e._v(" 都是固定的，于是我们又增加了 预加载"),t("code",[e._v("（preload）")]),e._v("，对减少 "),t("code",[e._v("LCP")]),e._v(" 有一定的效果。")])]),e._v(" "),t("h3",{attrs:{id:"子应用懒加载"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#子应用懒加载"}},[e._v("#")]),e._v(" 子应用懒加载")]),e._v(" "),t("p",[e._v("用户进入页面的时候，那个页面往往只属于一个子应用，也就是只有那个子应用是必须的，其他的子应用的注册不应该阻塞页面渲染，所以可以做成懒注册。")]),e._v(" "),t("p",[e._v("子应用资源拆分两部分：")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("initModule")]),e._v("：包含页面初始渲染必要的资源，例如路由信息")]),e._v(" "),t("li",[t("code",[e._v("lazyModule")]),e._v("：包含页面初始渲染不必要的资源，例如"),t("code",[e._v("store")]),e._v(" "),t("code",[e._v("initModule")]),e._v(" 的加载会阻塞渲染流程，而 "),t("code",[e._v("lazyModule")]),e._v(" 的加载则不会，它会跟 "),t("code",[e._v("initModule")]),e._v(" 并行加载。"),t("code",[e._v("lazyModule")]),e._v(" 只有在打开子应用的页面时才会被注册。")])]),e._v(" "),t("ol",[t("li",[e._v("模块注册时，如果存在"),t("code",[e._v("lazyModule")]),e._v("，将会创建一个"),t("code",[e._v("beforeEnter")]),e._v("函数。将该函数添加到"),t("code",[e._v("initModule")]),e._v("里的每个"),t("code",[e._v("route")]),e._v("里")])]),e._v(" "),t("h3",{attrs:{id:"按市场需要加载子应用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#按市场需要加载子应用"}},[e._v("#")]),e._v(" 按市场需要加载子应用")]),e._v(" "),t("p",[e._v("有一些子应用只在部分地区开放，为了节省资源和提升速度，其他地区没有必要加载，所以我们需要支持根据地区来按需加载子应用。")]),e._v(" "),t("p",[e._v("由于我们是通过内置的 "),t("code",[e._v("import")]),e._v(" 函数来引入子应用模块的，它会在编译时根据 "),t("code",[e._v("module federation")]),e._v(" 的 "),t("code",[e._v("remotes")]),e._v(" 来觉得这次编译有哪些子应用的 "),t("code",[e._v("remoteEntry")]),e._v(" 需要被加载。另外，我们所有地区用的都是同一份代码，所以代码里面必然存在所有子应用的 "),t("code",[e._v("import")]),e._v(" 语句，这样的话，编译出来的代码将包含所有加载 "),t("code",[e._v("remoteEntry")]),e._v(" 的代码。")]),e._v(" "),t("p",[e._v("因此，我们不能使用编译时方案，并且我们需要自定义加载 "),t("code",[e._v("remoteEntry")]),e._v(" 的方法，这样才可以避免加载不需要的子应用 "),t("code",[e._v("remoteEntry")]),e._v("。")]),e._v(" "),t("h2",{attrs:{id:"翻译工具-顺带看i18n开源原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#翻译工具-顺带看i18n开源原理"}},[e._v("#")]),e._v(" 翻译工具（顺带看i18n开源原理）")]),e._v(" "),t("h3",{attrs:{id:"原理细说"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#原理细说"}},[e._v("#")]),e._v(" 原理细说")]),e._v(" "),t("ol",[t("li",[t("code",[e._v("blueimp-md5")]),e._v("生成32位 最终使用slice(8, 24)截取了16位来作为"),t("code",[e._v("key")])])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("p",[t("code",[e._v("key")]),e._v("由 "),t("code",[e._v("Project")]),e._v(","),t("code",[e._v("NameSpace")]),e._v(","),t("code",[e._v("Label")]),e._v("加_拼接组成，所有空格替换为"),t("code",[e._v("_")])]),e._v(" "),t("ul",[t("li",[e._v("缩小平均长度：根据实际数据统计，生成的规范 label 平均长度在 25 以上，而且存在个别超长长度会影响数据边界")]),e._v(" "),t("li",[e._v("保证唯一性：采用 "),t("code",[e._v("md5")]),e._v(" 算法是为了保证唯一性，避免冲突")]),e._v(" "),t("li",[e._v("易于区分：工具生成的 "),t("code",[e._v("key")]),e._v(" 统一为 16 位 "),t("code",[e._v("MD5")]),e._v("，特征比较明显，便于后续工具分析和区分")])])]),e._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[e._v("项目名_key的模块名称（默认other）_label（需要翻译的文案）用来生成key。模块名称是指可能同一个文案label在不同模块下翻译含义可能有所不同")])])])}),[],!1,null,null,null);t.default=v.exports}}]);