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
