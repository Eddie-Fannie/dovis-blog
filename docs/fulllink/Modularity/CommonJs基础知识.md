# 认识CommonJS规范

1. CommonJS中规定每个文件是一个模块。将一个JavaScript文件直接通过script标签插入页面中与封装成CommonJS模块最大的不同在于，前者的顶层作用域是全局作用域，在进行变量及函数声明时会污染全局环境；而后者会形成一个属于模块自身的作用域，所有的变量及函数只有自己能访问，对外是不可见的。

2. 在`CommonJS`中通过`module.exports`可以导出模块中的内容，模块内部会有一个`module`对象用于存放当前模块的信息。**例子：**

   ```javascript
   module.exports = {
       name: 'calculater',
       add: function(a, b) {
           return a + b;
       }
   }
   // 简化书写（不推荐）
   exports.name = 'calculater';
   exports.add = function(a, b) {
       return a + b;
   }
   ```

3. 在使用exports时要注意不要直接给exports赋值，否则会导致失效：

   ```javascript
   exports = {
       name: 'calculater'
   }
   // 上面的代码由于对exports进行赋值操作，使其指向了新的对象，module.exports却仍然是原来的空对象，因此name属性并不会被导出。
   ```

4. `commonJS`用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

5. 当我们require一个模块时会有两个情况：

   > - require模块第一次被加载。这时会首先执行该模块，然后导出内容。
   > - require的模块曾被加载过。这时模块的代码不会再次执行，而是直接导出上次执行后得到的结果。

   