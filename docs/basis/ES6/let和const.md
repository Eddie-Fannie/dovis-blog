# 新增let const命令

## let命令
>类似var,但是所申明的变量只在`let`命令所在的代码块内有效。

```js
for(let i = 0;i<10;i++) {
    
}
console.log(i) // Uncaught ReferenceError: i is not defined
```

1. 不存在变量提升
> `var`会存在变量提升，即变量可以在声明前使用，值为`undefined`。函数表达式和箭头函数不会发生函数提升

2. 暂时性死区
> 只要块级作用域内存在`let`命令，所声明的变量就绑定这个区域，不受外部影响。

3. 不允许重复声明

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
