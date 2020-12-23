# 新增let const命令

## let命令
>类似`var`,但是所申明的变量只在`let`命令所在的代码块内有效。

```js
for(let i = 0;i<10;i++) {
    
}
console.log(i) // Uncaught ReferenceError: i is not defined
```

1. 不存在变量提升
> `var`会存在变量提升，即变量可以在声明前使用，值为`undefined`。函数表达式和箭头函数不会发生函数提升

2. 暂时性死区
> 只要块级作用域内存在`let`命令，所声明的变量就绑定这个区域，不受外部影响。

```js
var me = 'xiuyan'
{
    me = 'bear'
    let me;
}
// Uncaught ReferenceError: Cannot access 'me' beforeinitialization 
```
> 如果区块中存在`let/const`命令，这个区块对这些声明的变量，从一开始就形成封闭作用域。假如我们在声明前去使用这类变量，就会报错。这就是暂时性死区。**起始于函数开头，终止于相关变量声明语句的所在行**

```js
function bar1() {
    console.log(foo3) // 暂时性死区
    let foo3 = 'foo3'
    console.log(foo3) // 这里可以正常访问，当然是在前面不报错的前提下。
}
```

暂时性死区，函数的参数默认设置也会受它影响
```js
function foo(arg1=arg2,arg2) {
    console.log(`${arg1} ${arg2}`)
}
foo(undefined,'arg2')
// 因为arg2在后面还未定义，所以报错：Uncaught:ReferenceError: arg2 is not defined
```

3. 不允许重复声明
```js
function foo(arg1) {
    let arg1
}
foo('arg1')
```
> 报错：`Uncaught SyntaxError:Identifier 'arg1' has already been declared.`

## const命令
> `const`保证的并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型的数据，值就保存在变量指向的内存地址中，因此等同于变量。但对于引用类型数据来说，变量指向的内存地址保存的只是一个指针。因此**声明一个对象为常量必须非常小心**
```js
const foo = {}
// 可以
foo.prop = 123;

//将foo指向另一个对象，报错
foo = {} // TypeError: "foo" is read-only
```

## 新的声明变量方式差异
1. 顶层对象的属性
```js
var a = 2
console.log(window.a === 2) // true

let b = 3;
console.log(window.b) // undefined

const c = 4
console.log(window.c) // undefined
```
因为`const/let`会生成块级作用域，可以理解为
```js
let a = 10;
const b = 20;
相当于：
(function(){
    var a = 10;
    var b = 20;
})()
```

2. `var`存在变量提升，`let/const`没有。
3. 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部。

## 函数/变量提升

```js
console.log(foo); 
var foo = 1  //变量提升
console.log(foo)
foo()
function foo(){ //函数提升
   console.log('函数')
}

// 等价
function foo(){ //提到顶端
   console.log('函数')
}
var foo  
console.log(foo) //输出foo这个函数，因为上面foo没有被赋值，foo还是原来的值 
foo = 1;  //赋值不会提升,赋值后 foo就不再是函数类型了，而是number类型
console.log(foo) //输出1
foo() //这里会报错，因为foo不是函数了
```
## `Babel`编译处理

::: tip
- `Babel`编译会将`const/let`编译为`var`。为了保证`const`不可变性，`Babel`如果在编译过程中发现对`const`声明的变量进行二次赋值，则会直接报错，这样就可以在编译阶段对错误进行处理。
```js
"use strict"
function _readOnlyError(name) {
    throw new Error("\" + name + "\" is read-only")
}
var foo = 0;
foo = (_readOnlyError("a"),1)
```
> `Babel`只要检测到`const`声明的变量被改变赋值，就会主动插入一个`_readOnyError`函数，并执行此函数。这个函数的执行内容就是报错，因此代码执行时就会直接抛出异常。

- 至于`let`的块级概念，在`ES5`中一般通过立即调用函数表达式实现块级作用域，但是`Babel`对此的处理非常取巧，会在块内给变量换一个名字，这样在块外自然就无法被访问到了。
- 暂时性死区又是如何被`Babel`编译的呢？。其实`Babel`在编译时会将`let,const`变量重新命名，同时在js严格模式下不允许使用未声明的变量，这样在声明前使用这个变量就会报错。

- 对于经典的`for`循环问题。`Babel`处理并不让感到意外，具体还是使用闭包来存储变量

```js
let array = []
for(let i=0;i<10;i++) {
    array[i] = function() {
        console.log(i)
    }
}
array[6]() // 6

let array = []
for(var i=0;i<10;i++) {
    array[i] = function() {
        console.log(i)
    }
}
array[6]() // 10
```

`Babel`还使用了闭包保存每个循环变量`i`的值。
```js
'use strict'
var array = []
var _loop = function _loop(i) {
    array[i] = function() {
        console.log(i)
    }
}
for(var i=0;i<10;i++) {
    _loop(i)
}
array[6]()
```
:::