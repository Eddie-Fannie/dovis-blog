# ES6数据类型新增的属性和方法
## 变量的解构赋值
- 数组的解构赋值
```js
let [a,b,c] = [1,2,3] // a=1,b=2,c=3
let [head,...tail] = [1,2,3,4] // [2,3,4]
let [x,y,...z] = ['a'] // x='a',y=undefined,z=[]

// 默认值
let [foo=true] = [] // foo=true
let [x,y='b'] = ['a'] // x='a',y='b'
let [x,y='b'] = ['a',undefined] // x='a',y='b'
let [x=1] = [undefined] // x = 1
let [x=1] = [null] // x= null Es6中使用严格相等运算符来判断一个位置是否有值，所以如果一个数组成员!==undefined,默认值是不会生效的
```

- 对象的解构赋值
```js
var {foo:baz} = {foo:'aaa',bar:'bbb'}
baz // 'aaa'

let node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
}
var {loc,loc:{start},loc:{start:{line}}} = node; // line 1

// 对象解构也可以指定默认值
var {x=3} = {} // x=3
var {x,y=5} = {x:1} // x=1,y=5
var {x:y=3} = {} //y=3
var {x:y=3} = {x:5} // y=5

// 如果将一个已经声明的变量用于解构赋值，必须非常小心
let x;
{x} = {x:1} // SyntaxError: syntax error
// 正确
let x;
({x} = {x:1}) // ES6规则是，只要有可能导致解构歧义就不得使用圆括号

// 解构同时重命名
const school = {
    classes: {
        stu: {
            name:'Blob',
            age: 24
        }
    }
}
const {classes: {stu: {name: newName } } } = school
newName // Blob
```

::: tip
- 对象的解构赋值的内部机制是先找到同名属性，然后再赋值给对应的变量。真正被赋值的是后者，而不是前者。
```js
let {foo:baz} = {foo:'aaa',bar: 'bbb'}
baz // 'aaa'
foo // error:foo is not defined 
```

> 上面的代码中，`foo`是匹配的模式,`baz`才是变量。真正被赋值的是变量`baz`，而不是模式`foo`

```js
let obj = {
    p: [
        'Hello',
        {y: 'World'}
    ]
}
let {p: [x,{y}]} = obj
x// 'Hello'
y // World
```
> 这时`p`是模式不是变量，不会被赋值。如果要`p`被赋值，可以这样：

```js
let {p,p:[x,{y}]} = obj // 因为相对应let {p: p,p: [x,{y}]} = obj,后面那个p才是变量
```

- 默认值生效的条件是，对象的属性值严格等于`undefined`
```js
var {x=3} = {x:undefined}; // x=3
var {x=3} = {x:null} // x=null
```

- 数组本质是对象，因此可以对数组进行对象属性的解构
```js
let arr = [1,2,3]
let {0: first,[arr.length-1] : last} = arr;

first//1
last//3
```
:::

- 字符串解构
```js
const [a,b,c,d,e] = 'hello'
a // h
b // e
...
```

- 数值/布尔值
```js
// 解构赋值时，如果等号右边是数值/布尔值，先转对象
let {toString: a} = 123 ; // = true
s === Number.prototype.toString // true
```
> 只要等号右边部署对象/数组就会先将其转为对象。由于`undefined/null`无法转为对象，所以解构赋值时回报错`TypeError`

- 函数参数解构
```js
function add([x,y]) {
    return x + y
}
add([1,2]) // 3

[[1,2],[3,4]].map(([a,b]) => a +b)
// [3,7]

// undefined会触发函数参数的默认值
[1,undefined,3].map((x ='yes') => x) // [1,'yes',3]

//函数参数使用默认值 变量x,y指定默认值
function move({x=0,y=0} = {}) {
    return [x,y]
}
move({x:3,y:8}) // [3,8]
move({x:3}) //[3,0]
move({}) // [0,0]
move() // [0,0]

// 函数move参数指定默认值
function move({x,y} = {x:0,y:0}) {
    reutrn [x,y]
}
move({x:3,y:8}) // [3,8]
move({x:3}) // [3,undefined]
move({}) // [undefined,undefined]
move() // [0,0]
```

::: tip
```js
// 超级猩猩笔试题

//根据函数默认值和解构
function func() {
    return {
        a,b
    }
}
console.log(func()) // 输出{a:1,b:2}
console.log(func({a:3})) // 输出{a:3,b:456}
console.log(func({})) // 输出{a:123,b:456}

// 所以func函数参数如下
function func({a:a=123,b:b=456} = {a:1,b:2}) {
    return {
        a,
        b
    }
}
```
:::

### 圆括号问题
- 不能使用
    + 变量声明语句
    ```js
    let [(a)] = [1]
    ```
    + 函数参数
    + 赋值语句的模式
    ```js
    ({p:a}) = {p:42}

    [({p:a}),{x:c}] = [{},{}]
    ```

- 可以使用
    + 赋值语句的非模式部分
    ```js
    [(b)] = [3]
    ```

## 字符串的扩展
1. 每个字符固定两个字节
2. 字符串可以使用`for...of`遍历
3. `includes()`返回布尔值，表示是否找到参数字符串；`startsWith/endsWith()`表示参数字符串是否在源字符串头/尾部。这三个方法都支持第二个参数，表示开始搜索的位置。
> 使用第二个参数n时，`endsWith`的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对第n个位置到字符串结束位置之间的字符。
4. `repeat()`表示重复原字符串n次并返回新字符串。如果参数为小数会取整。参数为负数/`Infinity`就会报错。参数为`-1~0`之间就等同于`0`。参数`NaN`等同于`0`；如果参数为字符串就先转为数值。
5. `padStart/padEnd()`，有两个参数，第一个参数指定字符串最小长度，第二个指定补充的字符串。
```js
'x'.padStart(5,'ab') // ababx
```
- 如果原字符串长度比第一个参数大或相等，则返回原字符串。
- 补全后长度超过指定长度，则截掉超出的补全字符串
```js
'abc'.padStart(10, '0123456789') // '0123456abc'
```
- 省略第二个参数，则用空格补全。
6. 模板字符串
- 大括号内可以放任意的js表达式，可以进行运算，以及引用对象属性
- 如果大括号内的值不是字符串，按照一般规则转为字符串。比如为对象则默认调用对象的`toString`方法。
- 如果大括号内为字符串，则原样输出。

## 数值的扩展
1. 八进制用`0b/0B/0o/0o`表示。如果要使用`0b/0x`前缀的字符串数值转为十进制数值，要使用`Number`方法。
2. `Number.isFinite()`判断一个数值是否有限，有限返回`true`。`NaN`返回`false`，传入其他类型都返回`false`
3. `Number.isNaN()`检查一个值是否为NaN，非`NaN`一律返回`false`
```js
Number.isNaN(9/NaN) // true
Number.isNaN('true'/0) // true
Number.isNaN('true'/'true') // true
```
4. ES6将`parseInt/parseFloat()`方法从全局转移到了`Number`对象上，为了减少全局对象的方法，使得语言逐步模块化。方法使用没有变化。
5. `Number.isInteger()`判断一个值是否为整数，传入非数值类型都返回`false`。类似`3`和`3.0`这样将视为同一个值
6. `Number.EPSILON`。引入一个很小的数，目的在于为浮点数计算设置一个误差范围。浮点数计算结果小于该数就可以认为得到正确的结果。
7. `Number.isSafeInteger()`用来判断一个数是否在安全整数范围`（-2^53~2^53`）因为超过这个范围就无法精确表示。

::: tip
> js中所有数字都保存成`64`位浮点数，所以整数的精确度只能到`53`个二进制位。大于这个范围的整数就无法精确表示。所以引入新的数据类型`Integer`（整数）来解决这个问题。只能用来表示整数，没有位数限制，任何位数的整数都可以精确表示。**为了和`Number`类型区别必须使用后缀`n`表示。** 二进制，八进制，十六进制表示法后缀也要加上。

```js
1n + 2n = 3n
typeof 3n // 'bigint'
```

> js提供`Integer`对象用来生成`Integer`类型数值。转换规则如`Number()`一致。

```js
Integer(123) // 123n
Integer('123') // 123n
Integer(true) // 1n
Integer(false) // 0n

new Integer() // TypeError
```

> 在数学运算符号中，`Integer`类型的`+ - * **`二元运算符和`Number`类型行为一样，除法则舍去小数部分返回整数
```js
9n / 5n // 1n

1n + 1 // 报错，不能混合运算
```

**几乎所有`Number`运算符都可以用在该类型中，除了不带符号的右移位运算符`>>>`和一元的求正运算符`+`，因为会报错**。前者是因为该类型没有最高位，后者是在`asm.js`总是报错或者返回`Number`类型。

相等运算符会改变数据类型，也是不允许混合使用。精确相等运算符`===`则不会类型改变可以混合使用
```js
0n == 0 // TypeError
0n == false // TypeError

0n === 0 // false
```
:::

## Math对象的扩展
1. `Math.trunc()`去除一个小数的小数部分，返回整数部分。对于非数值的参数，用`Number()`转换为数值。对于空值和无法截取整数的值返回`NaN`
```js
Math.trunc('12.abc') // NaN
```
2. `Math.sign()`返回一个数是正数/负数/0。对于非数值的则转为数值，不能转为数值的则返回`NaN`。正数返回+1，负数为-1。-0则返回-0
```js
// 没有这个方法，可以这样
Math.sign = Math.sign || function(x) {
    x = +x; //类型转换
    if(x === 0 || isNaN(x)) {
        return x;
    } 
    return x > 0 ? 1 : -1
}
```
3. `Math.cbrt()`返回一个数的立方根
4. `Math.hypot()`返回所有参数的平方和的平方根
5. 指数运算符`**`。对于特别大的运算结果，和`Math.pow()`计算结果有略微差异。

## 对象的扩展


## 函数扩展
1. 默认参数为默认声明的，函数体内不能用`let/const`再次声明。默认参数应该是函数的尾参数，如果非尾部的参数设置默认值，实际上这个参数是无法忽略的，除非显式输入`undefined`。输入`null`没有这个效果。**使用参数默认值函数不能有同名参数**
```js
function foo(x=5,y=6) {
    console.log(x,y)
}
foo(undefined,null) // 5 null
```

```js
function foo(x,x,y=1) {
    ...
}
// SyntaxError: Duplicate parameter name not allowed in this context
```
2. 函数的`length`返回形参的个数。如果有默认值的参数，则减去。**形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。**。**与之对比的是，`arguments.length`是函数被调用时实际传参的个数。**
```js
(function (a) {}).length // 1
(function (a=5) {}).length // 0

(function(...args) {}).length // 0 剩余参数rest也不会计入length属性
```

**如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数。**
```js
(function (a=0,b,c){}).length // 0
(function(a,b=1,c){}).length // 1
```

3. `rest`参数之后不能再有其他参数，否则会报错。
4. ES2016做了规定，只要函数参数使用了默认值，解构赋值或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
5. 函数的`name`属性返回该函数的函数名。
- 如果将一个匿名函数赋值给一个变量，ES5的`name`属性会返回空字符串，而ES6返回实际的函数名
```js
var f = function(){}
f.name // '' es5
f.name // 'f' es6
```

- 如果将一个具名函数赋值给一个变量，`name`属性返回具名函数的名字，而不是变量名。
- `Function`构造函数返回的函数实例，`name`属性返回`anonymous`
- `bind`返回的函数，`name`属性会加上`bound`前缀

### 箭头函数
::: tip
+ 箭头函数使用的注意事项：
    - 函数体内的`this`对象就是定义时所在的对象，而不是使用所在的对象。
    - 不可以当作构造函数。也就是说，不可以使用`new`命令，否则会抛出错误。
    - 不可以使用`arguments`对象，该对象在函数体内不存在。可以使用`rest`剩余参数。
    - 不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数。
:::

> `this`指向的固定化并不是因为箭头函数内部有绑定`this`的机制，实际原因是箭头函数根本没有自己的`this`,导致内部的`this`就是外层代码块的`this`。正是因为没有`this`，所以不能用作构造函数。

**箭头函数转为ES5**
```js
// ES6
function foo() {
    setTimeout(() => {
        console.log('id:',this.id)
    },100)
}

//es5
function foo() {
    var _this = this
    setTimeout(function() {
        console.log('id:',_this.id)
    },100)
}
```

> 除了`this`以下三个变量也是箭头函数中不存在的，分别指向外层函数的对应变量：`arguments,super,new.target`。

```js
function foo() {
    setTimeout(() => {
        console.log('args:'+arguments)
    },100)
}
foo(2,4,6,8)
//args: [2,4,6,8]
```
> 箭头函数内部的变量`arguments`其实就是函数`foo`的`arguments`变量。

### 绑定`this`
> 函数绑定运算符是并排的双冒号`(::)`，双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象作为上下文环境（即`this`对象）绑定到右边的函数上。

```js
foo::bar
// 等同于
bar.bind(foo)
```

- 如果双冒号左边为空，右边为一个对象的方法，则等同于将该方法绑定到该对象上。
- 由于双冒号运算符返回的还是原来的对象，因此可以采用链式写法。

### 尾调用
> 函数最后一步是调用另一个函数

```js
function f(x) {
    return g(x)
}

// 这些就不是了
function f(x) {
    let y = g(x)
    return y;
}

function f(x) {
    return g(x) + 1
}
// 都是调用了函数之后还有接下来的操作，所以不是尾调用。
```

::: tip
函数调用会在内存形成一个调用记录，又称调用帧，保存调用位置和内部变量等信息。所有调用帧会形成一个调用栈。尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置，内部变量等信息就不会再用到了，直接在内层函数的调用帧取代外层函数的即可。

只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行尾调用优化。
:::

> 尾调用自身就是尾递归。对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

```js
function factorial(n) {
    if(n===1) return ;
    return n*factorial(n - 1)
}
factorial(5) // 120
```
> 阶乘函数，计算`n`的阶乘，最多需要保存`n`个调用记录，复杂度为`O(n)`。如果改写成尾递归，只保留一个调用记录，则复杂度为`O(1)`。

```js
function factorial(n,total) {
    if(n === 1) return total;
    return factorial(n-1,n*total)
}
factorial(5,1)
```

> 只要使用尾递归，就不会发生栈溢出，相对节省内存。

```js
function Fibonacci2(n,ac1=1,ac2=1) {
    if(n <= 1) {return ac2}
    return Fibonacci2(n-1,ac2,ac1 + ac2)
}
Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
```