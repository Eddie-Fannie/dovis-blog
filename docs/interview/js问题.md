# js面试问题列表

## 初级题

1. **深浅拷贝的原理及实现拷贝**
> [js对象的深浅拷贝](/dovis-blog/basis/JavaScript/对象深浅拷贝)

2. **为什么0.1+0.2 != 0.3**
> 因为JS采用IEEE 754双精度版本。计算机中所有数据都是以二进制存储的，然后再计算结果转换成十进制。所以这个问题就是二进制精度发生了丢失

**解决精度丢失导致结果不精确**
```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```
**测试两个浮点数有没有丢失精确度**
```js
function judgeFloat(n, m) {
    const binaryN = n.toString(2);
    const binaryM = m.toString(2);
    console.log(`${n}的二进制是    ${binaryN}`);
    console.log(`${m}的二进制是    ${binaryM}`);
    const MN = m + n;
    const accuracyMN = (m * 100 + n * 100) / 100;
    const binaryMN = MN.toString(2);
    const accuracyBinaryMN = accuracyMN.toString(2);
    console.log(`${n}+${m}的二进制是${binaryMN}`);
    console.log(`${accuracyMN}的二进制是    ${accuracyBinaryMN}`);
    console.log(`${n}+${m}的二进制再转成十进制是${to10(binaryMN)}`);
    console.log(`${accuracyMN}的二进制是再转成十进制是${to10(accuracyBinaryMN)}`);
    console.log(`${n}+${m}在js中计算是${(to10(binaryMN) === to10(accuracyBinaryMN)) ? '' : '不'}准确的`);
}
  function to10(n) {
    const pre = (n.split('.')[0] - 0).toString(2);
    console.log(pre)
    const arr = n.split('.')[1].split('');
    console.log(arr)
    let i = 0;
    let result = 0;
    while (i < arr.length) {
      result += arr[i] * Math.pow(2, -(i + 1));
      i++;
    }
    console.log(result)
    return result;
  }
  judgeFloat(0.1,0.2)
```

3. **下列输出原因：**
```js
console.log(Object instanceof Function) // true
console.log(Function instanceof Object) // true
```
> 构造函数本身又是方法(`Function`)的实例 --> `Function`是通过自己创建出来的,`Function`的`__proto__`指向的`Function.prototype`。`Object`实际上也是通过`Function`创建出来的。所以那么`Object`的`__proto__`指向的是`Function.prototype`--> **验证第一小题正确**；因为`JS`中所有的东西都是对象，那么`Function.prototype`也是对象，既然是对象，那么`Function.prototype`肯定是通过`Object`创建出来的。--> **验证第二小题正确**

综上所述，Function和Object的原型以及原型链的关系可以归纳为下图:
![img](/dovis-blog/js/function.jpg)

4. **不要在js中使用连等赋值操作**
```js
let a = { n:1 }
let b = a;
a.x = a = { n:2 }
console.log(a)
console.log(b)
```
![img](/dovis-blog/other/23.png)

[解析](https://www.cnblogs.com/xxcanghai/p/4998076.html)

5. **将字符串转为数值有几种**
- `parseInt/parseFloat`
- 按位取反：“按位取反” (~)。您仅可以使用它将字符串转换为整型，而不能转为浮点型数字。它比较好的一面是，当碰到非数字字符的时候，它会返回 0。
```js
~~1.23 // 1
~~'1.23' // 1
~~'23' // 23
~~'Hello world' // 0
~~-1.23 // -1
```
> 所以可以用双重非位运算来代替`Math.floor()`，优势在于运行快。
- `Number()`
- 一元操作符：一元操作会在处理非数字时，抛出一个 `NaN` 值。

6. **(a ==1 && a== 2 && a==3) 有可能是 true 吗？**
- 利用松散相等运算符 `==` 的工作原理，你可以简单地创建一个带有自定义`toString`( 或者 `valueOf`)函数的对象，在每一次使用它时候改变它所的返回值，使其满足所有三个条件。
```js
const a = {
  i: 1,
  valueOf: function () {
    return a.i++;
  }
}
if(a == 1 && a == 2 && a == 3) {
  console.log('Hello World!');
}
// Hello World!
```
> 由于表达式中使用了松散相等的运算符 `==`。使用松散相等时，如果其中一个操作数与另一个类型不同，则 JS 引擎将尝试将一个操作转换为另一个类型。在左边对象、右边的数字的情况下，它会尝试将对象转换为一个数，首先通过调用 `valueOf` 如果是可调用的。否则，它会调用`toString`方法。

- 使用一个`get`，让 `a` 的返回值为三个不同的值。然而这并不意味着我们应该在真正的代码中使用。。。
```js
var val = 0;
Object.defineProperty(window, 'a', {
  get: function() {
    return ++val;
  }
});
if (a == 1 && a == 2 && a == 3) {
  console.log('yay');
}
```
7. **`href="#"`与`href='javascript：void（0）'`的区别**
`href="#"`方法其实也是空连接的意思，但是点击之后会自动跳转到页面的最上面，因为用了这个方法就相当于点击了一个锚记，但是这个锚记又没写`ID`，所以就默认跳转到页面顶部。但是不整体刷新页面的情况下，可以使用`void(0)`。
```bash
javascript:void (expression) # 用法

<a href="javascript:void(0)">单此处什么也不会发生</a>  #单此处什么也不会发生

<a href="javascript:void(document.form.submit())"> 单此处提交表单</a> #单此处提交表单
```
> 链接（`href`）直接使用`javascript:void(0)`在IE中可能会引起一些问题，比如：造成gif动画停止播放等，所以，最安全的办法还是使用`“####”`。`href`上加`js`是为了防止链接跳转，以前用`#`但是在部分浏览器下回跳转到页面顶部。这样就不好了，于是有人想到了添加`onclick=“return false”`

8. **`return`和`return false`的区别**
> `return false`阻止默认行为，取消事件冒泡，以及停止回掉执行返回。`return`就是`return undefined`停止后续函数执行。

## 中级题
1. **在JavaScript文件开头包含`use strict`意义**
+ 严格模式的好处：
  - **使调试更容易。** 如果代码错误本来会被忽略或失败，那么现在将会产生错误或抛出异常，从而更快地发现代码中的问题，并更快地指引它们的源代码。
  - **防止意外全局** 如果没有严格模式，将值赋给未声明的变量会自动创建一个具有该名称的全局变量。这是`JavaScript`中最常见的错误之一。在严格模式下，尝试这样做会引发错误。
  - **消除隐藏威胁** 在没有严格模式的情况下，对`null`或`undefined`的这个值的引用会自动强制到全局。这可能会导致许多`headfakes`和`pull-out-your-hair`类型的错误。在严格模式下，引用`null`或`undefined`的这个值会引发错误。
  - **不允许重复的参数值** 严格模式在检测到函数的重复命名参数（例如，函数`foo（val1，val2，val1）{}）`时会引发错误，从而捕获代码中几乎可以肯定存在的错误，否则您可能会浪费大量的时间追踪。
  - **抛出无效的使用错误的删除符** 删除操作符（用于从对象中删除属性）不能用于对象的不可配置属性。当试图删除一个不可配置的属性时，非严格代码将自动失败，而在这种情况下，严格模式会引发错误。
  - **使用`eval()`更安全**  `eval()`在严格模式和非严格模式下的行为方式有些不同。最重要的是，在严格模式下，在`eval()`语句内部声明的变量和函数不会在包含范围中创建。

2. **['1','2','3'].map(parseInt)结果为啥，为什么？**
实际执行的代码：
```js
['1','2','3'].map((item, index) => {
  return parseInt(item, index)
})
// parseInt('1', 0) // 1
// parseInt('2', 1) // NaN
// parseInt('3', 2) // NaN 3不是二进制

// 如果要换成数字，把parseInt换成Number
```
3. **在 JavaScript 中如何检查对象为空**
```js
const empty = {};

Object.keys(empty).length === 0 && empty.constructor === object;
// 额外的构造函数检查，是为了避免Date，或者包装对象其他对象干扰

Object.prototype.toString.call(value) === '[object Object]' && JSON.stringify(value) === '{}' 
// 可以避免undefined/null
```

4. 以下代码输出什么？
```js
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```
![img](/dovis-blog/other/68.png)

::: tip
只要一个对象的 `length` 属性为数字，同时`splice`属性为函数时， 对象的函数输出结果就会变成 伪数组。

`push(1)`，因为此时`obj`中定义`length`为`2`，所以从数组中的第二项开始插入，也就是数组的第三项（下表为`2`的那一项），因为数组是从第`0`项开始的，这时已经定义了下标为`2`和`3`这两项，所以它会替换第三项也就是下标为`2`的值，第一次执行`push`完，此时`key`为`2`的属性值为`1`，同理：第二次执行`push`方法，`key`为`3`的属性值为`2`。因为只是定义了`2/3`项，没有定义`0/1`项，所以前面会是`empty`
:::

## 高级题
1. **回调地狱为什么不能捕获异常**
> 其实这跟 js 的运行机制相关，异步任务执行完成会加入任务队列，当执行栈中没有可执行任务了，主线程取出任务队列中的异步任务并入栈执行，当异步任务执行的时候，捕获异常的函数已经在执行栈内退出了，所以异常无法被捕获。

2. **回调地狱为什么不能`return`**
> `return`只能终止回调的函数执行，不能终止外部代码执行。

3. 以下代码输出结果为？
```js
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x) // undefined 	
console.log(b.x) // {n:2}
console.log(a) // {n:2}
console.log(b) // {n:1,x:{n:2}}
```

::: tip
1. 首先`a`变成`{n:1}`，然后`b`也是`{n:1`
2. 然后就变成`a`为`{n:2}`,`b`为`{n:1,x:{n:2}}`

> `.`运算符优先，`a.x`此时保持对`{n: 1}`的引用，也就是`b`也保持对`{n: 1}`的引用，于是`{n: 1} => {n: 1, x: undefined}`，此时`a`和`b`还是对原来对象的引用，只不过原来对象增加了`x`属性 
> `=`从右往左，`a = {n: 2}`，此时`a`的引用已经变成了`{n: 2}`这个对象 
> `a.x=a`，此时`a.x`是保持对`{ n: 1, x: undefined}`中的`x`引用，也就是`b.x`，于是`{ n: 1, x: undefined} => {n: 1, x: { n: 2}}`，即`b.x = { n: 2 }`
:::

4. 输出以下代码运行结果
```js
// example 1
var a={}, b='123', c=123;  
a[b]='b';
a[c]='c';  
console.log(a[b]);

---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  
a[b]='b';
a[c]='c';  
console.log(a[b]);

---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};  
a[b]='b';
a[c]='c';  
console.log(a[b]);
```

::: tip
- 对象的键名只能是字符串和 `Symbol` 类型。
- 其他类型的键名会被转换成字符串类型。
- 对象转字符串默认会调用 `toString` 方法。

```js
// example 1
var a={}, b='123', c=123;
a[b]='b';

// c 的键名会被转换成字符串'123'，这里会把 b 覆盖掉。
a[c]='c';  

// 输出 c
console.log(a[b]);

// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  

// b 是 Symbol 类型，不需要转换。
a[b]='b';

// c 是 Symbol 类型，不需要转换。任何一个 Symbol 类型的值都是不相等的，所以不会覆盖掉 b。
a[c]='c';

// 输出 b
console.log(a[b]);

// example 3
var a={}, b={key:'123'}, c={key:'456'};  

// b 不是字符串也不是 Symbol 类型，需要转换成字符串。
// 对象类型会调用 toString 方法转换成字符串 [object Object]。
a[b]='b';

// c 不是字符串也不是 Symbol 类型，需要转换成字符串。
// 对象类型会调用 toString 方法转换成字符串 [object Object]。这里会把 b 覆盖掉。
a[c]='c';  

// 输出 c
console.log(a[b]);
```
:::

> 除了`Symbol`基本数据类型为对象属性时不会覆盖之外，还可以利用`Map`数据结构进行存储，因为`Map`的键可以为任何数据类型。

5. 输出以下结果
```js
function Foo() {
  Foo.a = function() {
    console.log(1)
  }
  this.a = function() {
    console.log(2)
  }
}
// 以上只是Foo的构建方法，没有产生实例，此刻也没有执行
Foo.prototype.a = function() {
  console.log(3)
  // 现在在 Foo 上挂载了原型方法 a ，方法输出值为 3
}
Foo.a = function() {
  console.log(4)
  // 现在在 Foo 上挂载了直接方法 a ，输出值为 4
}

Foo.a();// 立刻执行了 Foo 上的 a 方法，也就是刚刚定义的，所以输出 4

let obj = new Foo();
/* 这里调用了 Foo 的构建方法。Foo 的构建方法主要做了两件事：
1. 将全局的 Foo 上的直接方法 a 替换为一个输出 1 的方法。
2. 在新对象上挂载直接方法 a ，输出值为 2。
*/

obj.a();// 因为有直接方法 a ，不需要去访问原型链，所以使用的是构建方法里所定义的 this.a，输出 2
Foo.a();// 构建方法里已经替换了全局 Foo 上的 a 方法，所以输出 1
```

::: tip
> `4 2 1`

只有`new`调用了`Foo`返回了函数实例对象，才导致全局上有`Foo.a`函数能执行，如下面这种情况将报错

```js
function Foo() {
  Foo.a = function() {
    console.log(2222)
  }
}
// let obj = new Foo()
Foo.a()
```

:::