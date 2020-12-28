# js中函数常见的一些问题
## 立即执行函数
> 作用在于创建独立的作用域，调用完立即销毁不会占用内存空间

```js
(function A() {
    console.log(A); // [Function A]
    A = 1
    console.log(window.A) //  undefined
    console.log(A) // [Function A]
})
```

```js
(function A() {
    console.log(A); // undefined
    var A = 1;
    console.log(window.A); // undefined
    console.log(A); // 1
}())
```
> `var`被提升到函数作用域内顶部，所以第一个打印出`undefined`。

```js
function A() {
    console.log(A); // [Function A]
    A = 1;
    console.log(window.A); // 1
    console.log(A); // 1
}
A();
```

```js
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
```
> 内部作用域，会先去查找是有已有变量`b`的声明，有就直接赋值`20`，确实有了呀。发现了具名函数 `function b(){}`，拿此`b`做赋值；`IIFE`(立即执行的函数表达式）的函数无法进行赋值（内部机制，类似`const`定义的常量），所以无效。（这里说的“内部机制”，想搞清楚，需要去查阅一些资料，弄明白`IIFE`在`JS`引擎的工作方式，堆栈存储`IIFE`的方式等）**所以重点就是非匿名自执行函数，函数名只读。函数名只是一个指向函数的指针**

::: tip
js将`function`关键字当作一个函数声明的开始，而函数声明后面不能跟圆括号。函数表达式的后面可以跟着圆括号。要将函数声明转换成函数表达式，只要加上一对圆括号就可以了。
```js
(function(){

})()

// 或者
(function(){

}())
```
:::