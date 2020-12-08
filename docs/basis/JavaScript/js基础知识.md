# JavaScript基础知识点
## 数据类型
1. 原始类型有`null`, `undefined`, `string`, `number`, `boolean`, `symbol`

> 所以`null`基本类型就不是`object`，虽然`typeof null`会输出`object`？是因为历史遗留。在JS的最初版本中使用的是`32`位系统，为了性能考虑使用低位存储变量的类型信息，`000`开头代表是对象，然而`null`表示为全零，所以将它错误的判断为`object` 。

2. 除了原始类型其他都是对象类型
> 原始类型存储的是值，对象类型存储的是地址（指针）。当创建一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）
```js
const b = []
```
::: tip
对于常量`b`来说，假设内存地址为`#001`，那么在地址`#001`的位置存放了值`[]`，常量`b`存放了地址`#001`。
:::

> 所以把一个对象赋值给一个变量的时候，这个时候赋值的其实是地址，所以当我们进行数据修改的时候，就会修改存放在地址上的值，也就导致两个变量的值都发生改变

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
:::

## 判断数据类型
- `typeof`：`null`、函数、数组都可以判断为对象`object`，所以不能准确判断变量到底是什么类型。
```js
var str1 = 123
console.log(typeof str1 === 'number') // true
console.log(typeof Array) // 'function'
console.log(typeof {}) // 'object'
console.log(typeof function name(){console.log(222)}) // 'function'
```
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
- `constructor`：原型`prototype`的一个属性，`null`和`undefined`没有这个属性所以无法判断类型。
```js
var o = ''
console.log(o.constructor === String) // true
console.log(o.constructor.name) // String
```

## 类型转换
+ 转换的情况：
    - 转换为布尔值
    - 转换为数字
    - 转换为字符串
1. 转换为布尔值
> 在条件判断时，除了`undefined`，`null`，`false`，`NaN`,`''`,`0`,`-0`，其他都转为`true`
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
    `toFixed(num)`:`toFixed()` 方法可把 `Number` 四舍五入为指定小数位数的数字; 参数`num`: 代表小数位数。**返回的是字符串格式了**
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
    parseInt(011,2) // NaN
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
> 调用数值的该方法时，传入一个参数作为基数，可以返回规定进制的字符串值。没有参数就默认十进制呗

```js
var num = 10
num.toString(16); // a
num.toString(8); // 12

// 引擎中这样执行，因为num基本数据类型没有toString方法
var num = new String(10);
num.toString(); // '10'
num = null;
```
> 上述代码是JS引擎自动执行的，你无法访问`num`对象，它只存在于代码的执行瞬间，然后立即销毁。

2. `null`和`undefined`因为没有相应对构造函数，所以没有`toString()`方法，则用`String()`方法转为字符串
```js
console.log(String(null)) // 'null'
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
    - 对象--> 调用对象`valueOf()`方法-->进行转换，若为`NaN`;则利用`toString()`方法继续。

2. `+`特别情况
- 两方都为字符串，则形成字符串拼接
- 运算中其中一方为字符串，那么就会把另外一方也转换为字符串
- 如果一方不是字符串或者数字，那么就会转换为数字或者字符串

```js
4+[1,2,3] // 41,2,3
4+{} // 4[object Object]
```
- 还得注意这种情况：

```js
'a'+ +'c' // aNaN
```
- 一元操作符在数值前相当于正负，若在对象，字符串，布尔值，浮点数前就会进行数值转换操作，规则和上述一样。
3. **除了加法运算符，其他运算符只要其中一方为数字，另外一方则转为数字。**
4. 乘性运算符：乘法，除法，求模。
> 参与乘性计算的某个操作符不是数值，则后台利用`Number()`转型函数转换为数值。
> `0`被`0`除结果为`NaN`
>求模中被除数为`0`，则结果为`0`

5. 比较运算符
- 如果一个操作数为数值，则将另外一个转换为数值
- 如果一个操作数为布尔值，则也转换为数值

6. 相等操作符
- `null` == `undefined`。这两个基本类型数据不能转换为其他值
- 两个操作数都为对象，就要看两个对象是否同一个。（地址是否指向同一个）
- 判断两者类型是否为`string/number`，是的话就会将字符串转换为`number`
- 判断其中一方是否为`boolean`，是的话就会把`boolean`转为`number`再进行判断。
- 判断其中一方是否为`object`且另一方为`string/number/symbol`，是的话就会把`object`转为原始类型再进行判断。
```js
[] == ![] // true 都转为0。后者![]是先布尔类型转换，转换为false，然后数值转换为0
'' == !'' // false 前者转为0后者为1
```
7. 逗号操作符
- 用于声明多个变量
- 用于赋值
```js
var num = (1,2,3,4) // num值为4 最后一个
```
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

## 值传递和引用传递
> ECMAScript中所有的函数的参数都是按值传递的。

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
位操作符用于最基本的层次上，即按内存中表示数值的位来操作数值。对于有符号的整数，`32`位中的前31位用于表示整数的值。第32位用于表示数值的符号：`0`表示正数，`1`表示负数。负数同样用二进制存储，但使用的格式是二进制补码。
+ 计算一个数的二进制补码：
    - 求这个数值绝对值的二进制码
    - 求二进制反码，即0替换为1，1替换为0
    - 得到的二进制反码加1.