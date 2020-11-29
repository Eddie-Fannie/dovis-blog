# 2.你不知道的Javascript（上卷）

## 第一部分 作用域和闭包

### 作用域是什么？
#### 编译原理
> 我们习惯将`var a = 2`；看作一个声明，而实际上JavaScript引擎并不这么认为。它将`var a`和`a= 2`当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。

传统编程语言，程序的一段源代码在执行前一般会执行三个步骤，统称为编译
1. 分词/词法分析
> 这个过程会将由字符串组成的字符串分解成有意义的代码块，这些代码块成为词法单元（`token`）。**是否会被当作词法单元，取决于对于编程语言来说是否有意义**

2. 解析/语法分析（Parsing)
> 这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树（ast,抽象语法树）

3. 代码生成
> 将抽象语法树转换为可执行代码的过程被称为代码生成。

#### 理解作用域
> 负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

::: tip
1. 变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值
:::

##### RSH/LSH查询
> 如果查找的目的是对变量进行赋值，那么就会使用`LHS`查询；如果目的是获取变量的值，就会使用`RHS`查询

> 当变量出现在赋值操作的左侧时进行`LHS`查询，出现在右侧时进行`RHS`查询，如果`RHS`查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出`ReferenceError`异常。值得注意的是，`ReferenceError`是非常重要的异常类型。相较之下，当引擎执行LHS查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非“严格模式”下。

> 如果`RHS`查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或者引用`null`或`undefined`类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作`TypeError`。`ReferenceError`同作用域判别失败相关，而`TypeError`则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

```js
function foo(a) {
    console.log(a) //2
}
foo(2)
```
> 最后一行`foo(...)`函数的调用需要对`foo`进行`RHS`引用。代码中隐式的`a=2`操作可能很容易被你忽略掉。这个操作发生在`2`被当作参数传递给`foo(..)`函数时，`2`会被分配给参数`a`。为了给参数`a`（隐式地）分配值，需要进行一次`LHS`查询。这里还有对`a`进行的`RHS`引用，并且将得到的值传给了`console.log(..)`。`console.log(..)`本身也需要一个引用才能执行，因此会对`console`对象进行RHS查询，并且检查得到的值中是否有一个叫作`log`的方法。

### 词法作用域
1. 全局变量会自动成为全局对象（比如浏览器中的`window`对象）的属性。通过这种技术可以访问那些被同名变量所遮蔽的全局变量。
2. 无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

### 函数作用域和块级作用域
1. 函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。

#### 函数声明和函数表达式
>  区分函数声明和表达式最简单的方法是看`function`关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如果`function`是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。**函数声明则不可以省略函数名**

#### 匿名函数
**缺点**
1. 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
2. 如果没有函数名，当函数需要引用自身时只能使用已经过期的`arguments.callee`引用，比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。
3. 匿名函数省略了对于代码可读性/可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

#### 立即执行函数表达式`IIFE`
```js
var a = 2;
(function foo() {
    var a = 3;
    console.log(a) // 3
})()
console.log(a) // 2

// 立即执行函数还可以传参数
var a = 2;
(function foo(global) {
    var a = 3;
    console.log(a) // 3
    console.log(global.a) // 2
})(window)
console.log(a) // 2

```
> 由于函数被包含在一对()括号内部，因此成为了一个表达式，通过在末尾加上另外一个()可以立即执行这个函数，比如(function foo(){ .. })()。第一个()将函数变成表达式，第二个()执行了这个函数。**相较于传统的`IIFE`形式，很多人都更喜欢另一个改进的形式：(function(){ .. }())。仔细观察其中的区别。第一种形式中函数表达式被包含在()中，然后在后面用另一个()括号来调用。第二种形式中用来调用的()括号被移进了用来包装的()括号中。**

#### 块作用域
```js
for(var i=0;i<10;i++) {
    console.log(i)
}

var foo = true
if(foo) {
    var bar = foo *2
    console.log(bar) // 2
}
console.log(bar) // 2
```
> 我们在`for`循环的头部直接定义了变量`i`，通常是因为只想在`for`循环内部的上下文中使用`i`，而忽略了i会被绑定在外部作用域（函数或全局）中的事实。**当使用`var`声明变量时，它写在哪里都是一样的，因为它们最终都会属于外部作用域。**

::: tip
1. 用`with`从对象中创建出的作用域仅在`with`声明中而非外部作用域中有效。
2. `try/catch`的`catch`分句会创建一个块作用域，其中声明的变量仅在`catch`内部有效。
:::

### 提升
> 无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。可以将这个过程形象地想象成所有的声明（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为提升。只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。如果提升改变了代码执行的顺序，会造成非常严重的破坏。

```js
foo(); // 不是ReferenceError，而是TypeError
var foo = function bar() {

}
```
> 这段程序中的变量标识符`foo()`被提升并分配给所在作用域（在这里是全局作用域），因此`foo()`不会导致`ReferenceError`。但是`foo`此时并没有赋值（如果它是一个函数声明而不是函数表达式，那么就会赋值）。`foo()`由于对`undefined`值进行函数调用而导致非法操作，因此抛出`TypeError`异常。

**同时也要记住，即使是具名的函数表达式，名称标识符在赋值之前也无法在所在作用域中使用：**
```js
foo() // TypeError
bar() // ReferenceError

var foo = function bar() {
    // ...
}
```
经过提升之后，相当于：
```js
var foo;
foo() // TypeError
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
> 注意，`var foo`尽管出现在`function foo()...`的声明之前，但它是重复的声明（因此被忽略了），因为函数声明会被提升到普通变量之前。

### 作用域闭包
> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。**无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。**

#### 循环和闭包
```js
for(var i =1;i<=5;i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i*1000)
}
```
这段代码在运行时会以每秒一次的频率输出五次`6`。

> 延迟函数的回调会在循环结束时执行，所以输出`6`可以理解。当定时器运行时即使每个迭代中执行的是`setTimeout(.., 0)`，所有的回调函数依然是在循环结束后才会被执行，因此会每次输出一个`6`出来。

#### 模块
![img](/dovis-blog/js/clousure.png)

这个模式在JS中被称为模块。
1. `CoolModule()`只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行外部函数，内部作用域和闭包都无法被创建。
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。**(当通过返回一个含有属性引用的对象的方式来将函数传递到词法作用域外部时，我们已经创造了可以观察和实践闭包的条件。)**


## 第二部分 this和对象原型

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
### 什么是`this`
> 当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。`this`就是这个记录的一个属性，会在函数执行的过程中用到。**this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用**，所以`this`类似动态作用域。**`this`在任何情况下都不指向函数的词法作用域**

::: tip
当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到。

**`this`既不指向函数自身也不指向函数的词法作用域,它指向什么完全取决于函数在哪里被调用。**
:::

### `this`全面解析
#### 绑定规则
1. 默认绑定-->指向全局对象
> `foo()`是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。如果使用严格模式（`strict mode`），则不能将全局对象用于默认绑定，因此`this`会绑定到`undefined`

2. 隐式绑定
> 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的`this`绑定到这个上下文对象。一个最常见的`this`绑定问题就是被隐式绑定的函数会丢失绑定对象。**参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值**

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

3. 显式绑定
- `call()`
```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2
}
foo.call(obj); // 2
```
#### 显式绑定变种解决丢失绑定问题
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

#### 硬绑定使用场景
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
#### 绑定意外
::: tip
1. 如果你把`null`或者`undefined`作为`this`的绑定对象传入`call、apply`或者`bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则。一般在使用`apply(..)`来“展开”一个数组，并当作参数传入一个函数。类似地，`bind(..)`可以对参数进行柯里化（预先设置一些参数），会这么绑定。

2. 一种“更安全”的做法是传入一个特殊的对象，把`this`绑定到这个对象不会对你的程序产生任何副作用。
```js
function foo(a,b) {
    console.log('a:' + a + ',b:' + b)
}
var dmz = Object.create(null)
foo.apply(dmz,[2,3]) // a:2,b:3
```
:::

### 第三章 对象
1. 在对象中，属性名永远都是字符串。如果你使用`string`字面量以外的其他值作为属性名，那它首先会被转换为一个字符串。即使是数字也不例外，虽然在数组下标中使用的的确是数字，但是在对象属性名中数字会被转换成字符串。
2. 如果你试图向数组添加一个属性，但是属性名看起来像一个数字，那它会变成一个数值下标（因此会修改数组的内容而不是添加一个属性）:
```js
var myArray = ['foo',42,'bar']
myArray['3'] = 'baz'
myArray.length // 4
myArray[3] // baz
```

3. 属性描述符
```js
var myObject = {
    a: 2
}
Object.getOwnPropertyDescriptor(myObject,'a')
// {
//    value: 2,
//    writable: true, // 可写
//    enumerable: true, // 可枚举
//    configurable: true // 可配置
// }
```
4. 在创建普通属性时属性描述符会使用默认值，也可以使用`Object.defineProperty(...)`来添加一个新属性或者修改一个已有属性（如果是`configurable`）并对特性进行配置。
```js
var myObject = {
    a: 2
}
Object.defineProperty(myObject,'a',{
   value: 2,
   writable: true, // 可写
   enumerable: true, // 可枚举
   configurable: true // 可配置
})
```
5. 不管是不是处于严格模式，尝试修改一个不可配置的属性描述符都会出错。把`configurable`修改成`false`是单向操作，无法撤销。不过我们还是可以把`writable`状态由`true`改为`false`，但是无法由`false`改为`true`。`configurable`为`false`时也不能删除这个属性。
6. 如果对象的某个属性是某个对象/函数的最后一个引用者，对这个属性执行`delete`操作之后，这个未引用的对象/函数就可以被垃圾回收。
7. 如果你想禁止一个对象添加新属性并且保留已有属性，可以使用`Object.preventExtensions(...)`
8. `Object.seal(...)`会创建一个密封的对象，这个方法实际上会在一个现有对象上调用`Object.preventExtensions(...)`并把所有现有属性标记为`configurable:false`
所以密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性，虽然可以修改属性的值。
9. `Object.freeze(...)`会创建一个冻结对象，这个方法实际上会在一个现有对象上调用`Object.seal(...)`并把所有数据访问属性标记为`writable:false`，这样就无法修改它们的值。这个对象引用的其他对象是不受影响的。可以深度冻结一个对象，遍历对象然后逐个调用该冻结方法，但是这样可能无意会冻结其他对象。
10. `myObject.a`实际是在`myObject`上实现了`[[Get]]`操作（有点像函数调用：`[[Get]]()`）。对象默认的内置`[[Get]]`操作首先在对象中查找是否有名称相同的属性，如果找到就会返回这个属性的值。其实就是遍历原型链。如果没有找到名称相同的属性，`[[Get]]`操作会返回`undefined`。
11. 对象默认的`[[Put]]`和`[[Get]]`操作分别可以控制属性值的设置和获取。
12. `in`操作符会检查属性是否在对象及其[[Prototype]]原型链中。相比之下，`hasOwnProperty(..)`只会检查属性是否在对象中，不会检查[[Prototype]]链。这时可以使用一种更加强硬的方法来进行判断：`Object.prototype.hasOwnProperty. call(myObject, "a")`，它借用基础的`hasOwnProperty(..)`方法并把它显式绑定到d对象上。看起来`in`操作符可以检查容器内是否有某个值，但是它实际上检查的是某个属性名是否存在。
13. 在数组上应用`for..in`循环有时会产生出人意料的结果，因为这种枚举不仅会包含所有数值索引，还会包含所有可枚举属性。最好只在对象上应用`for..in`循环，如果要遍历数组就使用传统的`for`循环来遍历数值索引。
14. `propertyIsEnumerable(..)`会检查给定的属性名是否直接存在于对象中（而不是在原型链上）并且满足`enumerable:true`。`Object.keys(..)`会返回一个数组，包含对象自身所有可枚举属性，`Object.getOwnPropertyNames(..)`会返回一个数组，包含所有属性，无论它们是否可枚举。`in`和`hasOwnProperty(..)`的区别在于是否查找[[Prototype]]链，然而，`Object.keys(..)`和`Object.getOwnPropertyNames(..)`都只会查找对象直接包含的属性。
15. `every(..)`和`some(..)`中特殊的返回值和普通`for`循环中的`break`语句类似，它们会提前终止遍历。`for..of`循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的`next()`方法来遍历所有返回值。
16. 数组有内置的`@@iterator`，因此`for..of`可以直接应用在数组上。我们使用内置的`@@iterator`来手动遍历数组，看看它是怎么工作的：
```js
var myArray = [1,2,3]
var it = myArray[Symbol.iterator]()
it.next() // {value:1,done:false}
it.next() // {value:2,done:false}
it.next() // {value:3,done:false}
it.next() // {done:true}
```
> 使用ES6中的符号`Symbol.iterator`来获取对象的`@@iterator`内部属性。`@@iterator`本身并不是一个迭代器对象，而是一个返回迭代器对象的函数。和数组不同，普通的对象没有内置的`@@iterator`，所以无法自动完成`for..of`遍历。之所以要这样做，有许多非常复杂的原因，不过简单来说，这样做是为了避免影响未来的对象类型。

**可以给任何想遍历的对象定义@@iterator**
```js
var myObject = {
    a:2,
    b:3
}
Object.defineProperty(myObject,Symbol.iterator, {
    enumerable:false,
    writable:false,
    configurable: true,
    value: function() {
        var o = this;
        var idx = 0;
        var ks = Object,keys(o)
        return {
            next: function() {
                return {
                    value: o[ks[idx++]],
                    done: (idx >ks.length)
                }
            }
        }
    }
})

// 手动遍历myObject
var it = myObject[Symbol.iterator]()
it.next()
it.next()
it.next()

// 用for...of遍历myObject
for(var v of myObject) {
    console.log(v)
}
```
> `for..of`循环每次调用`myObject`迭代器对象的`next()`方法时，内部的指针都会向前移动并返回对象属性列表的下一个值。

### 第四章 混合对象“类”
### 第五章 原型
#### `[[Prototype]]`
```js
myObject.foo = 'bar'
```
> 如果`myObject`对象中包含名为`foo`的普通数据访问属性，这条赋值语句只会修改已有的属性值。如果`foo`不是直接存在于`myObject`中，`[[Prototype]]`链就会被遍历，类似`[[Get]]`操作。如果原型链上找不到`foo`, `foo`就会被直接添加到`myObject`上。然而，如果`foo`存在于原型链上层，赋值语句`myObject.foo = "bar"`的行为就会有些不同（而且可能很出人意料）。如果属性名`foo`既出现在`myObject`中也出现在`myObject`的`[[Prototype]]`链上层，那么就会发生屏蔽。`myObject`中包含的`foo`属性会屏蔽原型链上层的所有`foo`属性，因为`myObject.foo`总是会选择原型链中最底层的`foo`属性。

::: tip
**如果`foo`不直接存在于`myObject`中而是存在原型链上层时上述代码会出现三种情况：**
1. 如果在`[[Prototype]]`链上层存在名为`foo`的普通数据访问属性并且没有被标记为只读`（writable:false）`，那就会直接在`myObject`中添加一个名为`foo`的新属性，它是屏蔽属性。
2. 如果在`[[Prototype]]`链上层存在`foo`，但是它被标记为只读`（writable:false）`，那么无法修改已有属性或者在`myObject`上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。**只读属性会阻止`[[Prototype]]`链下层隐式创建（屏蔽）同名属性。这样做主要是为了模拟类属性的继承。你可以把原型链上层的`foo`看作是父类中的属性，它会被`myObject`继承（复制），这样一来`myObject`中的`foo`属性也是只读，所以无法创建。但是一定要注意，实际上并不会发生类似的继承复制**
3. 如果在`[[Prototype]]`链上层存在`foo`并且它是一个`setter`，那就一定会调用这个`setter。foo`不会被添加到（或者说屏蔽于）`myObject`，也不会重新定义`foo`这个`setter`。

> 如果你希望在第二种和第三种情况下也屏蔽`foo`，那就不能使用`=`操作符来赋值，而是使用`Object.defineProperty(..)`来向`myObject`添加`foo`。
:::

有些情况下会隐式产生屏蔽：
```js
var anotherObject = {
    a: 2
}
var myObject = Object.create(anotherObject)
anotherObject.a //2
myObject.a //2

anotherObject.hasOwnProperty('a') // true
myObject.hasOwnProperty('a') // false

myObject.a++ // 隐式屏蔽
anotherObject.a //2
myObject.a //3

myObject.hasOwnProperty('a') // true
```
::: tip
尽管`myObject.a++`看起来应该（通过委托）查找并增加`anotherObject.a`属性，但是别忘了`++`操作相当于`myObject.a = myObject.a + 1`。因此`++`操作首先会通过`[[Prototype]]`查找属性`a`并从`anotherObject.a`获取当前属性值`2`，然后给这个值加`1`，接着用`[[Put]]`将值`3`赋给`myObject`中新建的屏蔽属性`a`。修改委托属性时一定要小心。如果想让`anotherObject.a`的值增加，唯一的办法是`anotherObject.a++`。
:::