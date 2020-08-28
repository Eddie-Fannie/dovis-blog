# 2.你不知道的Javascript（上卷）

**第一部分 作用域和闭包**
## 编译原理
> 我们习惯将`var a = 2`；看作一个声明，而实际上JavaScript引擎并不这么认为。它将`var a`和`a= 2`当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。

传统编程语言，程序的一段源代码在执行前一般会执行三个步骤，统称为编译
1. 分词/词法分析
> 这个过程会将由字符串组成的字符串分解成有意义的代码块，这些代码块成为词法单元（token）。**是否会被当作词法单元，取决于对于编程语言来说是否有意义**

2. 解析/语法分析（Parsing)
> 这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树（ast,抽象语法树）

3. 代码生成
> 将抽象语法树转换为可执行代码的过程被称为代码生成。

## 作用域
> 负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

## RSH/LSH查询
> 如果查找的目的是对变量进行赋值，那么就会使用LHS查询；如果目的是获取变量的值，就会使用RHS查询

> 当变量出现在赋值操作的左侧时进行LHS查询，出现在右侧时进行`RHS`查询，如果RHS查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出`ReferenceError`异常。值得注意的是，`ReferenceError`是非常重要的异常类型。相较之下，当引擎执行LHS查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非“严格模式”下。

> 如果RHS查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或者引用`null`或`undefined`类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作`TypeError`。`ReferenceError`同作用域判别失败相关，而`TypeError`则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

## 词法作用域
1. 全局变量会自动成为全局对象（比如浏览器中的`window`对象）的属性。通过这种技术可以访问那些被同名变量所遮蔽的全局变量。
2. 无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

## 函数声明和函数表达式
>  区分函数声明和表达式最简单的方法是看`function`关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如果`function`是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。

## 匿名函数
**缺点**
1. 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
2. 如果没有函数名，当函数需要引用自身时只能使用已经过期的`arguments.callee`引用，比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。
3. 匿名函数省略了对于代码可读性/可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

## 声明提升
```js
foo(); // 不是ReferenceError，而是TypeError
var foo = function bar() {

}
```
经过提升之后，相当于：
```js
var foo;
foo()
bar() // ReferenceError
foo = function() {
    var bar = ...self...
}
```

> 函数比变量先提升
```js
foo(); // 1
var foo;
function foo() {
    console.log(1);
}
foo = function() {
    console.log(2);
}
```
这个代码片段会被引擎理解为：
```js
function foo() {
    console.log(1);
}
foo(); //1
foo = function() {
    console.log(2)
}
```
> 注意，var foo尽管出现在function foo()...的声明之前，但它是重复的声明（因此被忽略了），因为函数声明会被提升到普通变量之前。

## 循环和闭包
```js
for(var i =1;i<=5;i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i*1000)
}
```
这段代码在运行时会以每秒一次的频率输出五次6
> 延迟函数的回调会在循环结束时执行，所以输出6可以理解。当定时器运行时即使每个迭代中执行的是`setTimeout(.., 0)`，所有的回调函数依然是在循环结束后才会被执行，因此会每次输出一个6出来。

## 模块
![img](/dovis-blog/js/clousure.png)

这个模式在JS中被称为模块。
1. `CoolModule()`只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行外部函数，内部作用域和闭包都无法被创建。
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。**(当通过返回一个含有属性引用的对象的方式来将函数传递到词法作用域外部时，我们已经创造了可以观察和实践闭包的条件。)**

**第二部分 this和对象原型**
上例子 ：
```js
function identify() {
    return this.name.toUpperCase();
}
function speak() {
    var greeting = 'hello I am' + identify.call(this);
    console.log(greeting)
}
var me = {
    name: 'Kyle'
};
var you = {
    name: 'Reader'
};
identify.call(me) // KYLE
identify.call(you) // READER
speak.call(me) // hello I amKYLE
```
## 什么是`this`
> 当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到。**this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用**，所以this类似动态作用域

## 隐式绑定
> 一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象
```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
}
var bar = obj.foo; // 函数别名
var a = 'lll' // a是全局对象的属性
bar(); // lll
```

## 显式绑定
1. call()
```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2
}
foo.call(obj); // 2
```
### 显式绑定变种解决丢失绑定问题
1. 硬绑定
```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2
};
var bar = function() {
    foo.call(obj);
};
bar(); // 2
setTimeout(bar, 100); // 2
// 硬绑定的bar不可能再修改它的this
bar.call(window) // 2
```

### 硬绑定使用场景
- 创建一个包裹函数，负责接受参数并返回值：
```js
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}                             
var obj = {
    a: 2
}       
var bar = function() {
    return foo.apply(obj, arguments)
}                                  
var b = bar(3); // 2 3
console.log(b); // 5                         
```

- 创建一个可以重复使用的辅助函数：
```js
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}                             
function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments)
    }
}
var obj = {
    a: 2
}                                                                                                                                                                                                                          
var bar = bind(foo, obj);
var b = bar(3) // 2 3
console.log(b) // 5
```