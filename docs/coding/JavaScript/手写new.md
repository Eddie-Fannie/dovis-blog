# 手写new关键字
+ `new`包括四个阶段
    - 创建一个新对象
    - 这个新对象的`__proto__`属性指向原函数的`prototype`属性。(即继承原函数的原型)
    - 将这个新对象绑定到 此函数的 `this` 上 。 
    - 返回新对象，如果这个函数没有返回其他对象。

```js
// 1、Con: 接收一个构造函数
// 2、args:传入构造函数的参数 
function create(Con, ...args){
    // 创建空对象
    let obj = {};
    // 设置空对象的原型(链接对象的原型)
    obj._proto_ = Con.prototype;
    // 绑定 this 并执行构造函数(为对象设置属性)
    let result = Con.apply(obj,args)
    // 如果 result 没有其他选择的对象，就返回 obj 对象 
    return (result instanceof Object) && result != null ? result : obj;
}

// 构造函数
function Test(name, age) {
    this.name = name
    this.age = age
}
Test.prototype.sayName = function () {
    console.log(this.name)
}
// 实现一个 new 操作符
const a = create(Test,'linjiaheng','22') 
console.log(a.age)
```
> 通过现代浏览器的操作属性的便利性，可以改变一个对象的 `[[Prototype]]` 属性, 这种行为在每一个`JavaScript`引擎和浏览器中都是一个非常慢且影响性能的操作，使用这种方式来改变和继承属性是对性能影响非常严重的，并且性能消耗的时间也不是简单的花费在 `obj.__proto__ = ...` 语句上, 它还会影响到所有继承来自该 `[[Prototype]]` 的对象，如果你关心性能，你就不应该在一个对象中修改它的 `[[Prototype]]`。相反, 创建一个新的且可以继承`[[Prototype]]` 的对象，推荐使用 `Object.create()`

```js
function create(Con, ...args){
    // 创建空对象
    let obj = {};
    // 设置空对象的原型(链接对象的原型)
    obj = Object.create(Con.prototype);
    // 绑定 this 并执行构造函数(为对象设置属性)
    let result = Con.apply(obj,args)
    // 如果 result 没有其他选择的对象，就返回 obj 对象 
    return (result instanceof Object ) && result != null ? result : obj;
}
```
::: tip
构造函数执行，不写 `return`，浏览器会默认返回创建的实例，但是如果我们自己写了`return`。
- 基本值:`return`是一个基本值，返回的结果依然是类的实例，没有收到影响。 
- 引用值:如果返回的是一个对象，则将默认的返回的实例覆盖，接收的结果就不再是当前类的实例。
:::