# JavaScript基础知识点
## 数据类型
1. 原始类型有`null`, `undefined`, `string`, `number`, `boolean`, `symbol`，`bigInt`

> 所以`null`基本类型就不是`object`，虽然`typeof null`会输出`object`是因为历史遗留。在JS的最初版本中使用的是`32`位系统，为了性能考虑使用低位存储变量的类型信息，`000`开头代表是对象，然而`null`表示为全零，所以将它错误的判断为`object` 。

2. 除了原始类型其他都是对象类型
> 原始类型存储的是值，对象类型存储的是地址（指针）。当创建一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）
```js
const b = []
```
::: tip
对于常量`b`来说，假设内存地址为`#001`，那么在地址`#001`的位置存放了值`[]`，常量`b`存放了地址`#001`。

+ `undefined`典型用法
  - 变量被声明了，但没有赋值时，就等于 `undefined`。
  - 调用函数时，应该提供的参数没有提供，该参数等于`undefined`。
  - 对象没有赋值的属性，该属性的值为 `undefined`。
  - 函数没有返回值时，默认返回 `undefined`。

`undefined`和`null`的区别：
在 `JavaScript` 中，`null` 和 `undefined` 都表示没有值的情况，但它们具有不同的含义。

- `undefined` 表示声明了一个变量，但没有给它赋值。未初始化的变量默认值为 `undefined`。当函数没有返回值时，返回值为 `undefined`。在访问对象上不存在的属性时，返回值也是 `undefined`。
- `null` 表示一个值被明确地定义为空值。可以将其赋给任何类型的变量，如对象、数组等，表示这个变量不引用任何对象或数组元素。

在使用时，通常情况下：
- 如果想要表示一个变量没有被赋值，就可以将其初始化为 `undefined`；
- 如果想要表示一个变量明确地为空，就可以将其赋值为 `null`。

需要注意的是，在比较时，`null` 和 `undefined` 的比较需要使用严格相等运算符（===），因为它们有不同的数据类型。例如，`undefined == null` 返回 `true`，但是 `undefined === null` 返回 `false`。
:::

> 所以把一个对象赋值给一个变量的时候，这个时候赋值的其实是地址，所以当我们进行数据修改的时候，就会修改存放在地址上的值，也就导致两个变量的值都发生改变

## 值传递和引用传递
当给函数传递基本数据类型的参数时，函数内部修改该参数不会导致参数本身发生变化，这就是按值传递的意思。那么当参数类型为引用类型的时候，就是按引用传递参数了吗？并不是！！**当函数参数是引用类型时，我们同样将参数复制了一个副本到局部变量，只不过复制的这个副本是指向堆内存中的地址而已，我们在函数内部对对象的属性进行操作，实际上和外部变量指向堆内存中的值相同，但是这并不代表着引用传递。**

```js
let obj = {};
function changeValue(obj){
  obj.name = 'linjiaheng';
  obj = {name:'kobe'};
}
changeValue(obj);
console.log(obj.name); // linjiaheng
```
> 所以记住：**函数参数传递的并不是变量的引用，而是变量拷贝的副本，当变量是原始类型时，这个副本就是值本身，当变量是引用类型时，这个副本是指向堆内存的地址。**

> 函数传递对象参数其实是相当于**接受实参的隐式引用**，在函数内部修改传进去的对象属性，会导致传入的对象变化。

```js
function test(person) {
  person.age = 26
  person = {
    name: 'yyy',
    age: 30
  }

  return person
}
const p1 = {
  name: 'yck',
  age: 25
}
const p2 = test(p1)
console.log(p1) // -> ?
console.log(p2) // -> ?
```
![img](/dovis-blog/other/53.png)
::: tip
实参不是对象时就是按值传递，函数的形参是被调用时所传实参的副本。修改形参的值并不会影响实参。

- 函数参数为基本数据类型时，函数体内复制了一份参数值，任何操作都不会影响原参数的实际值。
- 函数参数是引用类型时，当在函数体内修改这个值的某个属性值时，将会对原来的参数进行修改。
- 函数参数是引用类型时，如果直接修改这个值的引用地址。比如`person={...}`新的属性值赋予给对象。则相对于在函数体内新建了一个引用，任何操作都不会影响到原来参数的实际值。
:::

## 判断数据类型
- `typeof`：`null`、函数、数组都可以判断为对象`object`，所以不能准确判断变量到底是什么类型。
```js
var str1 = 123
console.log(typeof str1 === 'number') // true
console.log(typeof Array) // 'function'
console.log(typeof {}) // 'object'
console.log(typeof function name(){console.log(222)}) // 'function'

// function /object
function fun1(){};
const fun2 = function(){};
const fun3 = new Function('name','console.log(name)');

const obj1 = {};
const obj2 = new Object();
const obj3 = new fun1();
const obj4 = new new Function();

console.log(typeof Object);//function
console.log(typeof Function);//function
console.log(typeof fun1);//function
console.log(typeof fun2);//function
console.log(typeof fun3);//function
console.log(typeof obj1);//object
console.log(typeof obj2);//object
console.log(typeof obj3);//object
console.log(typeof obj4);//object
```
![img](/dovis-blog/other/85.png)

> 所有 `Function` 的实例都是函数对象，其他的均为普通对象，其中包括 `Function` 实例的实例。

- `instanceof`：判断的原理是根据原型链
```js
function Person() {

}
let p1 = new Person()
console.log(p1 instanceof Person) // true
console.log(p1 instanceof Object) // true
console.log(Person instanceof Object) // true
console.log(Person instanceof Function) // true
console.log(Object instanceof Function) // true
```
```js
var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true
```
> 对于原始数据类型要直接使用`instanceof`是行不通的，为啥第二个例子就可以呢？是因为这个时候已经使用`new String`强制转换成`String`对象类型。**`instanceof`后面跟着是构造函数，`typeof`和基本类型比较**

```js
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === 'string'
  }
}
console.log('hello world' instanceof PrimitiveString) // true
```

- `toString`:最完美的方案
```js
function checkType(payload) {
  switch(Object.prototype.toString.call(payload)) {
    case '[object Null]': console.log('null')
      break;
    case '[object Number]': console.log('number')
      break;
    case '[object String]': console.log('string')
      break;
    case '[object Undefined]': console.log('undefined')
      break;
    case '[object Boolean]': console.log('boolean')
      break;
    case '[object Array]': console.log('Array')
      break;
    case '[object Object]': console.log('Object')
      break;
    case '[object Number]': console.log('NaN')
      break;
    // 还有其他类型Map Symbol等不一一列举
  }
}
checkType({a:2}) // Object
```
:::tip
同样是检测对象 `obj` 调用 `toString` 方法，`obj.toString()` 的结果和 `Object.prototype.toString.call(obj)` 的结果不一样，这是为什么？

这是因为 `toString` 是 `Object` 的原型方法，而 `Array` 、`function` 等类型作为 `Object` 的实例，都重写了 `toString` `方法。。不同的对象类型调用toString` 方法时，根据原型链的知识，调用的是对应的重写之后的 `toString` 方法（ `function` 类型返回内容为函数体的字符串，`Array` 类型返回元素组成的字符串…），而不会去调用 `Object` 上原型 `toString` 方法（返回对象的具体类型），所以采用 `obj.toString()` 不能得到其对象类型，只能将 `obj` 转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用 `Object` 原型上的 `toString` 方法。
:::

- `constructor`：原型`prototype`的一个属性，`null`和`undefined`没有这个属性所以无法判断类型。
> 有两个作用，一是判断数据的类型，二是对象实例通过对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，就不能判断数据类型了。

```js
var o = ''
console.log(o.constructor === String) // true
console.log(o.constructor.name) // String

// 改变constructor
function Fn(){};

Fn.prototype = new Array();

var f = new Fn();
console.log(f.constructor === Fn); // false
console.log(f.constructor === Array); // true;
```

## 类型转换
+ 转换的情况：
    - 转换为布尔值
    - 转换为数字
    - 转换为字符串
1. 转换为布尔值
> 在条件判断时，除了`undefined`，`null`，`false`，`NaN`,`''`,`0`,`-0`，`0n`（`bigint`类型）其他都转为`true`
> 在利用`Boolean()`方法强类型转换时，只有`false`,空字符串，`0/NaN`，`null`，`undefined`会转换为`false`。其余都转为`true`

```js
Boolean([]) // true
Boolean({}) // true
```

2. `Number`类型
- 八进制：前面为`0`，如`070`(八进制`56`)。如果其余数值超过`7`，则忽略前面的`0`直接解析为十进制数值
```js
console.log(079) // 79
```
- 十六进制：前面跟着`0x`其余为（`0~9及A~F）`
- 可以使用`isFinite()`函数判断参数位于最小`Number.MIN_VALUE`和最大值`MAX_VALUE`之间，是则返回`true`

**数值转换**
+ 1. `Number()`函数
  - `Boolean`--> `true`转为`1`，`false`转为`0`
  - 数值则简单传入传出
  - `null`--> `0`
  - `undefined`--> `NaN`
  + 字符串
      - 字符串只包含数字（包括正负，八进制）全部转为十进制的
      - 字符串包含浮点，则转为对应的浮点值，同样忽略八进制前导`0`
      - 字符串包含有效的十六进制则转为相对应的十进制数值
      - 空字符串则转为`0`
      - 其他情况则转为`NaN`
  - 对象: 调用对象的`valueOf()`（返回对象的原始值），然后依照规则转换返回的值。如果转换的结果是`NaN`，则调用对象的`toString()`方法，然后再次依照前面的规则转换返回的字符串值。
  ```js
  let obj={
      value:'你好啊',
      num:2,
      toString:function(){
        return this.value
      },
      valueOf:function(){
        return this.num
      },
  }
  console.log(obj+'明天')  //2明天
  console.log(obj+1)    // 3
  console.log(String(obj))   // 你好啊
  ```
  > 当对象进行类型转换时：1.首先调用`valueOf`，如果执行结果是原始值，返回，如果不是下一步。2.其次调用`toString`,如果执行结果是原始值,返回，如果不是，报错。特殊情况:当使用显示类型转换成`String`时，执行顺序则是先调用`toString`,其次调用`valueOf`


  ::: tip
  1. `Number(['1'])`转为`1`。先调用`valueOf`转成`['1']`还不是原始值，则调用`toString`转成`'1'`。
  2. `'true' == true //false Number('true')->NaN  Number(true)->1`
  3. `toFixed(num)`:`toFixed()` 方法可把 `Number` 四舍五入为指定小数位数的数字; 参数`num`: 代表小数位数。**返回的是字符串格式了**
  4. `'' == null`为`false`。`{}+10`返回`10`。`10+{}`返回`10[object Object]`
  :::

+ 2. `parseInt()`函数，解析字符串，并返回一个整数
  - 忽略字符串前面的空格，直到找到第一个非空格字符。如果第一个字符非数值或者负号，就会返回`NaN`。**也就是说空字符串转为`NaN`，而不是`0`**
  - 如果第一个字符为数值，则继续解析后面的字符，直到遇到非数值字符。
  ```js
  parseInt('123blue') // 123
  parseInt('1231.11') // 1231 小数点为非数值字符
  parseInt('abc123') // NaN
  ```
  - 能够有效识别前导，`0x`识别为十六进制然后转为十进制。八进制的时候则忽略前面的`0`
  ```js
  parseInt('0x11') // 17
  parseInt('011') // 11 而不是9 IE下才是9，十进制
  parseInt(011) // 这才是9,011解析成字符串'011'识别为八进制
  parseInt('011',2) // 3
  parseInt(011,2) // 011->9,二进制只有0/1，所以NaN
  parseInt(111,2) // 7
  parseInt(8,3) // 表示在基数3中“解析"8"。但是，在基体3中，1位数字只是0,1和2。由于没有有效字符，返回NaN 。
  parseInt(16, 3) //要求它在基数3中解析"16"。因为它可以解析1，它会解析，然后它在6处停止，因为它无法解析它。 所以它返回1 。
  parseInt(020,10) // 16 即parseInt('020',8)
  ```
  > 没有忽视`0`真正转为八进制是ES3下，忽略`0`的是ES5。ES5的引擎下该函数不具解析八进制的能力了。所以该函数才提供了第二个参数**转换时使用的基数**

  ```js
  var num = parseInt('010',8)
  console.log(num) // 8
  ```
  ::: tip
  - 如果指定基数为`16`，则字符串不用带`0x`。**如果参数 `radix` 小于` 2 `或者大于 `36`，并且第一个参数数值不能大于第二个基数，这样才能有效进行进制转换，否则 `parseInt()` 将返回 `NaN`。**
  ```js
  parseInt('111', 0) //111 返回第一个参数的number类型
  ```
  - 如果忽略或者为`0`，那么数字使用十进制表示的。
  ```js
  parseInt('111') // 111
  ```
  - 如果数字是以`0x`或`0X`开头的那么数字使用十六进制表示。
  - **待考察**

  ```js
  parseInt(0.5); // -> 0
  parseInt(0.05); // -> 0
  parseInt(0.005); // -> 0
  parseInt(0.0005); // -> 0
  parseInt(0.00005); // -> 0
  parseInt(0.000005); // -> 0
  parseInt(0.0000005); // -> 5
  ```
  :::

+ 3. `parseFloat()` 解析一个字符串并返回一个浮点数
    - 从第一个字符解析，遇到无效的浮点数字字符就终止解析。如第二个小数点。
    - 始终忽略前导`0`
    - 只解析十进制，因此没有第二个参数作为基数。
    - 十六进制格式的字符串始终解析成`0`
    ```js
    parseFloat('0x11') // 0
    ```
    - 字符串如果为可以解析成整数的，则会返回整数
    ```js
    parseFloat('123blue') // 123

    parseFloat('qwar4s2') // NaN
    ```

3. `String`类型

**转为字符串**
1. `toString()`（`null`和`undefined`没有这个方法）
> 该方法属于对象`Object`方法，由于所有对象都继承了`Object`的对象实例。所以`Array/Boolean/Date/Error/Function/Number/String`都能调用该方法。调用数值的该方法时，传入一个参数作为基数，可以返回规定进制的字符串值。没有参数就默认十进制呗

```js
var num = 10
num.toString(16); // 'a' a的十六进制为10
num.toString(8); // '12'

// 引擎中这样执行，因为num基本数据类型没有toString方法
var num = new Number(10);
num.toString(); // '10'
num = null;
```
> 上述代码是JS引擎自动执行的，你无法访问`num`对象，它只存在于代码的执行瞬间，然后立即销毁。

2. `null`和`undefined`因为没有相应对构造函数，所以没有`toString()`方法，则用`String()`方法转为字符串
```js
console.log(String(null)) // 'null'
```

3. 在js中数字后面的`'.'`操作符意义不确定。因为可能是一个浮点数的标志也可能是取一个对象的属性的运算符。但是js的解释器把它当成了浮点数的标志。
```js
console.log(10.toString())// Uncaught SyntaxErro: Invalid or unexpected token
console.log(10..toString()) // '10'
console.log((10.).toString) // '10'
```

## 运算符
1. `++`和`--`
> 递增和递减操作符，放在数值前面后面结果是截然不同的。放前面是：先进行递增或递减再进行运算；放后面是先进行运算，再进行递增或递减。
```js
var age = 22
var herAge = 23
// var all = ++age + herAge
// console.log(all) // 46
var twoAll = age-- + herAge
console.log(twoAll) // 45
console.log(age) // 21
```
+ 递增递减运算符用在布尔值，字符串，浮点数值和对象的情况:
    - 包含有效数值的字符串-->转为数字值-->再递增或递减
    - 不包含有效数值-->`NaN`
    - 布尔值-->`1/0`-->再递增或递减
    - 浮点-->执行加减1操作
    - 对象--> 调用对象`valueOf()`方法-->进行转换，若为`NaN`;则利用`toString()`方法继续。[解析对象原始值转换](/dovis-blog/basis/JavaScript/解析对象原始值转换)

2. `+`特别情况
- 两方都为字符串，则形成字符串拼接
- 运算中其中一方为字符串，那么就会把另外一方也转换为字符串
- 如果一方是对象则调用`valueOf/toString`方法取得值，将其转换为基本数据类型再进行字符串拼接
- 其他情况都会转为`number`类型，`undefined`转为`NaN`
- 如果是`Infinity+Infinity`则结果为`Infinity`
- 如果是`-Infinity + (-Infinity)`则结果是`-Infinity`
- 如果是`Infinity + (-Infinity)`则为`NaN`

```js
4+[1,2,3] // 41,2,3
4+{} // 4[object Object]
```
- 还得注意这种情况：

```js
'a'+ +'c' // aNaN

undefined+10 //NaN undefined转为NaN

console.log({}+true) // [object Object]true
{}+true // 1 浏览器控制台

" \t \n" - 2  // -2 

'1'+1n // '11' 比较特殊字符串和BigInt相加，BigInt转换为字符串
1+1n // 错误，不能把数值和BigInt相加
```

> 字符串转换为数字时，会忽略字符串的开头和结尾处的空格字符。在这里，整个字符串由空格字符组成，包括 `\t、\n `以及它们之间的“常规”空格。因此，类似于空字符串，所以会变为 `0`。

- 一元操作符在数值前相当于正负，若在对象，字符串，布尔值，浮点数前就会进行数值转换操作，规则和上述一样。
3. **除了加法运算符，其他运算符只要其中一方为数字，另外一方则转为数字。**
4. 乘性运算符：乘法，除法，求模。
> 参与乘性计算的某个操作符不是数值，则后台利用`Number()`转型函数转换为数值。

> `0`被`0`除结果为`NaN`,`7/0`为`Infinity`，Math.pow(10, 1000)也为`Infinity`

> 求模中被除数为`0`，则结果为`0`

5. 比较运算符
- 如果一个操作数为数值，则将另外一个转换为数值
- 如果一个操作数为布尔值，则也转换为数值

6. 相等操作符
- **`null` == `undefined`**。这两个基本类型数据不能转换为其他值，即如果其中一个操作值是`null/undefined`，那么另一个操作符必须为`null/undefined`，才会返回`true`，否则都是`false`。
- 两个操作数都为对象，就要看两个对象是否同一个。（地址是否指向同一个）
- 判断两者类型是否为`string/number`，是的话就会将字符串转换为`number`
- 判断其中一方是否为`boolean`，是的话就会把`boolean`转为`number`再进行判断。
- 判断其中一方是否为`object`且另一方为`string/number/symbol`，是的话就会把`object`转为原始类型再进行判断。
- 如果其中一个操作数为`Symbol`类，那么返回`false`
```js
[] == ![] // true 都转为0。后者![]是先布尔类型转换，转换为false，然后数值转换为0
'' == !'' // false 前者转为0后者为1

var a = [0];
if (a) {
  console.log(a == true); // false
} else {
  console.log(a);
}
```
7. 逗号操作符
- 用于声明多个变量
- 用于赋值, 逗号操作符只返回最后一个操作符的值
```js
var num = (1,2,3,4) // num值为4 最后一个
```
- 尾逗号
```js
[,] + [,]; // -> ""
[] + [] === [,] + [,]; // -> true
[,,,] + [,,,]; // -> ",,,,"
([,,,] + [,,,]).length === [,,,,].length; // -> true
```
:::tip
**不合法的尾后逗号**
- 仅仅包含逗号的函数参数定义或者函数调用会
- 当使用剩余参数的时候，并不支持尾后逗号
- 解构时使用剩余参数也会抛出错误
- JSON格式

```js
function f(,) {} // SyntaxError: missing formal parameter
(,) => {};       // SyntaxError: expected expression, got ','
f(,)             // SyntaxError: expected expression, got ','

function f(...p,) {} // SyntaxError: parameter after rest parameter
(...p,) => {}        // SyntaxError: expected closing parenthesis, got ','

var [a, ...b,] = [1, 2, 3];
// SyntaxError: rest element may not have a trailing comma

//JSON不允许尾后逗号
JSON.parse('[1, 2, 3, 4, ]');
JSON.parse('{"foo" : 1, }');
// SyntaxError JSON.parse: unexpected character
// at line 1 column 14 of the JSON data
```
:::

8. 布尔操作符
- 如果操作数为一个对象（空数组也是），则逻辑非结果为`false`
+ 逻辑与**在有一个操作数不是布尔值的情况下**
  - 第一个操作数是对象，则返回第二个操作数；
  - 第二个操作数为对象，只有第一个操作数为`true`时，才会返回该操作数
  - 如果两个都为对象，则返回第二个
  - 如果有一个操作数为`null,NaN,undefined`,则返回`null,NaN,undefined`
+ 逻辑或**在有一个操作数不是布尔值的情况下**
  - 如果第一个操作数为对象，则返回第一个操作数
  - 如果第一个操作数为`false`，返回第二个操作数
  - 如果两个操作数都为对象，返回第一个操作数
  - 如果两个操作数都为`null,NaN,undefined`,则返回`null,NaN,undefined`

9. `??`操作符（零合并操作符）
> 如果第一个参数不是`null/undefined`，这个运算符返回第一个参数，否则返回第二个。

```js
null??5 // 5
3??5 //3
```

10. `??=`(逻辑空值赋值运算符)
```js
var x = null
var y = 5

console.log(x ??= y) 
// => 5
console.log(x = (x ?? y)) 
// => 5
```

11. `?.`可选链操作符
> 可选的链式操作符`?. `允许开发人员读取深嵌在对象链中的属性值，而不必显式验证每个引用。当一个引用为空时，表达式停止计算并返回一个未定义的值。

```js
var travelPlans  = {
  destination: 'DC',
  monday: {
    location: 'National Mall',
    budget: 200
  }
};
const tuesdayPlans = travelPlans.tuesday?.location;
console.log(tuesdayPlans) // => undefined
```
::: tip
现在就可以利用可选链操作符解决`cannot read property of undefined`的一个常见错误。

传统解决方法就是：
- 通过`&&`短路运算符来进行嗅探
- 通过`||`设置默认保底值
- 利用`try...catch`
```js
var result
try {
    result = obj.user.posts[0].comments
} catch {
    result = null
}
```
:::

### 运算符优先级
> 关联性决定了拥有相同优先级的运算符的执行顺序。

```bash
a OP b OP c;
```

> 左关联（左到右）相当于把左边的子表达式加上小括号`(a OP b) OP c`，右关联（右到左）相当于`a OP (b OP c)`。赋值运算符是右关联的。

```js
a = b =5
```
> 结果 `a` 和 `b` 的值都会成为`5`。这是因为赋值运算符的返回结果就是赋值运算符右边的那个值，具体过程是：`b`被赋值为`5`，然后`a`也被赋值为` b=5 `的返回值，也就是`5`。

下表将所有运算符优先级从高`(21)`到低`0`
![img](/dovis-blog/other/69.png)

![img](/dovis-blog/other/70.png)

![img](/dovis-blog/other/71.png)

![img](/dovis-blog/other/72.png)

![img](/dovis-blog/other/73.png)

![img](/dovis-blog/other/74.png)

## 基本包装类型
> 实际上每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。

```js
var s1 = 'some text'
var s2 = s1.substring(2)
```
::: tip
引用类型与基本包装类型主要区别是对象生存期。使用`new`操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一代代码的执行瞬间，然后立即销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。
:::

1. 对基本包装类型的实例调用`typeof`会返回`object`，而且所有基本包装类型的对象在转换布尔值类型都为`true`
2. `Object`构造函数会像工厂函数一样，创造基本包装类型的实例。也可以使用`new`调用基本包装类型（不过不推荐这种方法）。
```js
var obj = new Object('test')
console.log(obj instanceof String) // true

var value = '25'
var obj2 = new Number(value)
console.log(typeof obj2) // object
```

### `String`类型
- 基于子字符串创建新字符串的方法：第一个参数指定子字符串开始位置；第二个参数表示哪里截至（可选）。`substr()`方法第二个参数表示返回字符串字符的个数。
    + `slice`
    + `substring`
    + `substr`
传递负值参数时。`slice`会将负值和长度相加，`substr`会将第一个负值和长度相加，第二个转为`0`；`substring`会将所有负值参数都转为`0`

- `trim()`：删除前后空格符，返回一个字符串副本。`trimLeft/trimRight`
- `charCodeAt()`：获取字符编码。


## 位操作符
位操作符用于最基本的层次上，即按内存中表示数值的位来操作数值。对于有符号的整数，`32`位中的前`31`位用于表示整数的值。第`32`位用于表示数值的符号：`0`表示正数，`1`表示负数。负数同样用二进制存储，但使用的格式是二进制补码。
+ 计算一个数的二进制补码：
    - 求这个数值绝对值的二进制码
    - 求二进制反码，即`0`替换为`1`，`1`替换为`0`
    - 得到的二进制反码加`1`

`~`：按位非（本质：操作数的负值减`1`）
`&`：按位与

|第一个数值位|第二个数值位|结果|
|---------|---|---|
|`1`|`1`|`1`|
|`1`|`0`|`0`|
|`0`|`1`|`0`|
|`0`|`0`|`0`|

`|`：按位或:

|第一个数值位|第二个数值位|结果|
|---------|---|---|
|`1`|`1`|`1`|
|`1`|`0`|`1`|
|`0`|`1`|`1`|
|`0`|`0`|`0`|

`^`：按位异或：

|第一个数值位|第二个数值位|结果|
|---------|---|---|
|`1`|`1`|`0`|
|`1`|`0`|`1`|
|`0`|`1`|`1`|
|`0`|`0`|`0`|

> 和按位或的区别是两位操作数对应的数值位的数值要不相同才为`1`，相同则结果为`0`

`<<`:左移
> 左移时右边会出现空位就用`0`来填充，以便得到的结果是完整的`32`位二进制数。左移不会影响符号位

`>>`：有符号的右移
> 这个操作符将数值向右移动，但保留符号位。有符号位的右移操作和左移操作恰好相反。**右移左边出现的空位会用符号位上的值来填充**

`>>>`：无符号右移
> 将`32`位都向右移动。**对正数来说该操作和有符号右移相同。对负数来说无符号右移是用`0`来填充空位了。其次，无符号右移操作符会把负数的二进制码当成正数的二进制码。而且，由于负数以其绝对值的二进制补码形式表示，因此就会导致无符号右移后结果非常之大。**