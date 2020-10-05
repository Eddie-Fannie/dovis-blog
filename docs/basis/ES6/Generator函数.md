# Generator 函数
形式上，`Generator`函数是一个普通函数，有两个特征：
1. `function`命令和函数名之间有一个星号
2. 函数体内部使用`yield`语句定义不同的内部状态。

`Generator`函数的调用方法和普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用`Generator`函数后，该函数不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。（遍历器对象）。下一步，必须调用遍历器对象的`next`方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个`yield`表达式（或`return`语句）为止。换言之，`Generator`函数是分段执行的，`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行。

## `yield`表达式

```js
function *foo(x) {
  let y = 2 * (yield (x + 1))
  let z = yield (y / 3)
  return (x + y + z)
}
let it = foo(5)
console.log(it.next())   // => {value: 6, done: false}
console.log(it.next(12)) // => {value: 8, done: false}
console.log(it.next(13)) // => {value: 42, done: true}
```
::: tip
第一次调用，`Generator`函数开始执行，直到遇到第一个`yield`表达式为止。`next`方法返回一个对象，它的`value`属性就是当前`yield`表达式的值为`6`,`done`属性的值为`false`，表示遍历还没有结束。

下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

当执行第二次 `next` 时，传入的参数等于上一个 `yield` 的返回值，如果你不传参，`yield` 永远返回 `undefined`。此时 `let y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`

当执行第三次 `next` 时，传入的参数会传递给 `z`，所以 `z = 13, x = 5, y = 24`，相加等于 `42`

如果没有遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回对象的`value`属性值。

如果该函数没有`return`语句，则返回的对象`value`属性值为`undefined`
:::

> `yield`表达式与`return`语句既有相似之处，也有区别。相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到`yield`，函数暂停执行，下一次再从该位置继续向后执行，而`return`语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）`return`语句，但是可以执行多次（或者说多个）`yield`表达式。正常函数只能返回一个值，因为只能执行一次`return`；`Generator` 函数可以返回一系列的值，因为可以有任意多个`yield`。

## 注意的点
1. `Generator`函数可以不用`yield`表达式，这时就变成一个单纯的暂缓执行函数
```js
function* f() {
    console.log('执行了')
}
var generator = f()
setTimeout(function () {
    generator.next()
},2000)
```
> 上面代码中，函数`f`如果是普通函数，在为变量`generator`赋值时就会执行。但是，函数`f`是一个 `Generator` 函数，就变成只有调用`next`方法时，函数`f`才会执行。

2. `yield`表达式只能用在`Generator`函数里面，用在其他地方都会报错。
3. `yield`表达式如果用在另一个表达式之中，必须放在圆括号里。
4. `yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。