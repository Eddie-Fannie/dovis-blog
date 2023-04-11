# 深入 Webpack 的 Tree Shaking
- 编译阶段利用 `ES6 Module` 判断哪些模块已经加载
- 判断哪些模块和变量未被使用或者引用，进而删除对应代码。