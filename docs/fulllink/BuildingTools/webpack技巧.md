# Webpack技巧

## Webpack易遗忘点
1. 工程上线进行依赖安装，可以通过`npm install--production`过滤掉`devDependencies`中的冗余模块，从而加快安装和发布的速度。

## require.context
**在使用`electron-vue` 开发跨端字体测试工具时，项目目录store/modules/index.js中有这段代码：** 

```javascript
const files = require.context('.', false, /\.js$/)
const modules = {}
files.keys().forEach(key => {
if (key === './index.js') return /*如果某个文件不想引入可以这么操作*/
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
 
export default modules
```
后面查阅学习得知：如果项目越来越复杂，store/modules下文件越来越多，这样一个一个加载就很麻烦。所以`require.context()` 就是实现动态加载`modules` 下的所有文件，来实现前端工程化。

`require.context()` API如下：

```javascript
require.context(
    directory: String,/* 路径,在哪个文件下写这个，就以该文件为参考 */
    includeSubdirs: Boolean, /* 可选的，是否包含子目录,默认值是true */
    filter: RegExp, /* 可选的，默认值是/^\.\/.*$/,所有文件 */
    mode: String /* 可选的， 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once' 默认值sync*/
)
``` 