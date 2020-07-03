# JavaScript基础知识点
## 数据类型
1. 原始类型有`null`, `undefined`, `string`, `number`, `boolean`, `symbol`

> 所以null基本类型就不是object，虽然`typeof null`会输出`object`？是因为历史遗留。在JS的最初版本中使用的是32位系统，为了性能考虑使用低位存储变量的类型信息，000开头代表是对象，然而`null`表示为全零，所以将它错误的判断为`object` 。

2. 除了原始类型其他都是对象类型
> 原始类型存储的是值，对象类型存储的是地址（指针）。当创建一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）
```js
const b = []
```
::: tip
对于常量`b`来说，假设内存地址为`#001`，那么在地址`#001`的位置存放了值`[]`，常量`b`存放了地址`#001`。
:::

> 所以把一个对象赋值给一个变量的时候，这个时候赋值的其实是地址，所以当我们进行数据修改的时候，就会修改存放在地址上的值，也就导致两个变量的值都发生改变

> 函数传递对象参数其实是相当于传递对象指针的副本，所以函数内修改参数对象属性的时候，并不会影响传递进去的对象本身，例如工厂模式生成对象的情况。

3. 判断数据类型
- `typeof`：null,函数，数组都可以判断为对象，所以不能准确判断变量到底是什么类型
```js
var str1 = 123
console.log(typeof str1 === 'number') // true
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
```
```js
var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true
```
> 对于原始数据类型要直接使用`instanceof`是行不通的，为啥第二个例子就可以呢？是因为这个时候已经使用`new String`强制转换成`String`对象类型。**`instanceof`后面跟着是构造函数，`typeof`和基本类型比较**

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
        // 还有其他类型Map Symbol等不一一列举
    }
}
checkType({a:2}) // Object
```