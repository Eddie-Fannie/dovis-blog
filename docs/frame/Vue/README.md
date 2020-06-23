## Vue

### Vue.js源码目录
![img](/dovis-blog/vue/1.png)

**compiler**
> compiler目录包含Vue所有编译相关的代码。包括把模板解析成ast语法树，ast语法树优化，代码生成等功能。

**core**
> core目录包含了vue的核心代码，包括内置组件，全局API封装，Vue实例化，观察者，虚拟DOM，工具函数等。

**platform**
> Vue.js是跨平台框架，可以跑在web上，也可以配合weex跑在客户端上。

**server**
> 支持服务端渲染。这部分代码跑在服务端的`Node.js`

**sfc**
> 这个目录的代码逻辑会把.vue文件内容解析成一个Javascript对象。

**shared**
> 浏览器和服务器端端Vue.js共享一些工具方法。