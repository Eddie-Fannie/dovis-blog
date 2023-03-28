## Vue 架构设计与项目结构

### Vue.js源码目录结构
![img](/dovis-blog/vue/1.png)

**script**
> 与构建相关的脚本和配置文件

**dist**
> 构建后的文件

**flow**
> `Flow`的类型声明

**package**
> `vue-server-renderer`/`vue-template-compiler`作为单独`NPM`包发布，自动从源码中生成，并且始终和`vue.js`具有相同版本

**compiler**
> 所有编译相关的代码。包括把模板解析成`ast`语法树，`ast`语法树优化，代码生成等功能。

**core**
> 核心代码，包括内置组件，全局`API`封装，`Vue`实例化，观察者，虚拟`DOM`，工具函数等。

:::tip
- `observer`：实现变化侦测的代码
- `vdom`：实现虚拟`dom`的代码
:::

**platform**
> `Vue.js`是跨平台框架，可以跑在`web`上，也可以配合`weex`跑在客户端上。

**server**
> 支持服务端渲染。这部分代码跑在服务端的`Node.js`

**sfc**
> 这个目录的代码逻辑会把`.vue`文件内容解析成一个`Javascript`对象。

**shared**
> 浏览器和服务器端端`Vue.js`共享一些工具方法。