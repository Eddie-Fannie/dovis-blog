# JavaScript的一些内置对象方法汇总

## Object
### `Object.getOwnPropertyDescriptor()`
>`Object.getOwnPropertyDescriptor()`方法返回指定对象上一个自有属性对应的属性描述符。自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性。--来源MDN<br/>
>该方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用该方法。 

```javascript
Object.getOwnPropertyDescriptor(obj, prop) // obj 需要查找的目标对象。 prop目标对象内属性名称
```
>该方法允许对一个属性的描述进行检索。在 Javascript 中， 属性 由一个字符串类型的“名字”（name）和一个“属性描述符”（property descriptor）对象构成。

**例子1**
```javascript
function Person() {
    
}
Person.prototype.name = "Nicholas"
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer"
Person.prototype.sayName = function() {
    console.log(this.name)
}

var person1 = new Person()
person1.name = 'john'

let d;
d = Object.getOwnPropertyDescriptor(person1, 'name')

console.log(d)
```
**结果如下：**

![img](/dovis-blog/js/getOwnPropertyDescriptor.png)
- `value`: 该属性的值
- `writable`： 当属性的值可以被改变时就为true，意味可写
- `configurable`: 当且仅当指定对象的属性描述可以被改变或者属性可以被删除时为true
- `enumerable`： 当且仅当指定对象的属性可以被枚举时，为true
- `get`：获取该属性的访问器函数（getter）。如果没有则undefined
- `set`： 获取该属性的设置器函数（setter）

</br>

**例子2**
```javascript
var o, b;
o = {get foo() {return 17;}}
b = Object.getOwnPropertyDescriptor(o, 'foo')
console.log(b)
```
![img](/dovis-blog/js/get2.png)

**注意**
> 在 ES5 中，如果该方法的第一个参数不是对象（而是原始类型），那么就会产生出现 TypeError。而在 ES2015，第一个的参数不是对象的话就会被强制转换为对象。

如上述例子中修改成：
```javascript
d = Object.getOwnPropertyDescriptor(Person, 'name')

console.log(d)
```
![img](/dovis-blog/js/3.png)

### `Object.keys()`
>要取得对象上所有可枚举的实例属性，可以使用该方法。这个方法接受一个对象作为参数，返回一个包含所有可枚举属性的字符串数组。
```javascript
function Person() {
    
}
Person.prototype.name = "Nicholas"
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer"
Person.prototype.sayName = function() {
    console.log(this.name)
}
var person1 = new Person()
person1.name = 'john'

console.log(Object.keys(Person.prototype)) // ["name", "age", "job", "sayName"]
console.log(Object.keys(person1)) // ["name]

```
如果想要得到所有实例属性，无论是否可以枚举，可以使用`Object.getOwnPropertyNames()`方法。
```javascript
console.log(Object.getOwnPropertyNames(Person.prototype)) // ["constructor", "name", "age", "job", "sayName"]
```
**这两个方法都可以用来代替`for-in`循环**

### `Object.defineProperty()`
>`Object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
```javascript
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```
>第三个参数是要定义或修改的属性描述符<br/>

>默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改（immutable）的。<br/>

>对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。

>这两种描述符都是对象。它们共享以下可选键值（默认值是指在使用 Object.defineProperty() 定义属性时的默认值）：
`configurable`: 默认false。表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。
`enumerable`：默认false

数据描述符：
`value`:默认undefined<br/>
`writable`：默认为false，当为true时，value值才可以被赋值运算符修改。<br/>

存取描述符：
`get` 默认undefined<br/>
`set` 默认undefined

>如果一个描述符不具有 value、writable、get 和 set 中的任意一个键，那么它将被认为是一个数据描述符。

**如果使用直接赋值的方式创建对象的属性，数据描述符中的属性默认值是不同的**
```javascript
var o = {}
o.b = 4; //enumerable 为true

// 等同于：
Object.defineProperty(o, "a", {
  value: 4,
  writable: true,
  configurable: true,
  enumerable: true
});
```
