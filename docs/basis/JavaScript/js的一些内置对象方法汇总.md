# JavaScript的一些内置对象方法汇总

## `Object.getOwnPropertyDescriptor()`
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
> 在 ES5 中，如果该方法的第一个参数不是对象（而是原始类型），那么就会产生出现 `TypeError`。而在 ES2015，第一个的参数不是对象的话就会被强制转换为对象。

如上述例子中修改成：
```javascript
d = Object.getOwnPropertyDescriptor(Person, 'name')

console.log(d)
```
![img](/dovis-blog/js/3.png)

## `Object.keys()`
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

## `Object.defineProperty()`
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

>默认情况下，使用 `Object.defineProperty()` 添加的属性值是不可修改（`immutable`）的。<br/>

>对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。

>这两种描述符都是对象。它们共享以下可选键值（默认值是指在使用 `Object.defineProperty()` 定义属性时的默认值）：
`configurable`: 默认`false`。表示对象的属性是否可以被删除，以及除 `value` 和 `writable` 特性外的其他特性是否可以被修改。
`enumerable`：默认`false`

数据描述符：
`value`:默认`undefined`<br/>
`writable`：默认为`false`，当为`true`时，`value`值才可以被赋值运算符修改。<br/>

存取描述符：
`get` 默认`undefined`<br/>
`set` 默认`undefined`

>如果一个描述符不具有 `value、writable、get` 和 `set` 中的任意一个键，那么它将被认为是一个数据描述符。

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

旧方法里要创建访问器属性，一般都使用两`__defineGetter__()`和`__defineSetter__()`。
```js
var book = {
  _year: 2004,
  edition: 1
}
book.__defineGetter__('year', function() {
  return this._year;
})
book.__defineSetter__('year', function(newValue) {
  if(newValue > 2004) {
    this._year = newValue;
    this.edition += newValue - 2004;
  }
})
book.year = 2005;
console.log(book.edition) // 2
```

## `Object.defineProperties()`
> `Object.defineProperties()` 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

通过描述符一次定义多个属性。两个参数：第一个对象是要添加和修改其属性的对象；第二个对象的属性与第一个对象中要添加修改的属性一一对应。
```js
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  }
  // etc. etc.
});
```
## `Object.assign()`
`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source); // 单纯的复制一个对象，这是浅拷贝

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```
> `Object.assign` 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的`[[Get]]`和目标对象的`[[Set]]`，所以它会调用相关 `getter` 和 `setter`。因此，它分配属性，而不仅仅是复制或定义新的属性。**属性描述符会丢失。**

1. 继承属性和不可枚举属性是不能拷贝
```js
const obj = Object.create({foo: 1}, { // foo 是个继承属性。
    bar: {
        value: 2  // bar 是个不可枚举属性。
    },
    baz: {
        value: 3,
        enumerable: true  // baz 是个自身可枚举属性。
    }
});

const copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```
2. 原始类型会被包装为对象
```js
const v1 = "abc";
const v2 = true;
const v3 = 10;
const v4 = Symbol("foo")

const obj = Object.assign({}, v1, null, v2, undefined, v3, v4); 
// 原始类型会被包装，null 和 undefined 会被忽略。
// 注意，只有字符串的包装对象才可能有自身可枚举属性。
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```
3. 拷贝异常会打断后面的拷贝任务

## `Object.getPrototypeOf()`
> 返回指定对象的原型（内部`[[Prototype]]`属性的值）
```js
var proto = {};
var obj = Object.create(proto);
Object.getPrototypeOf(obj) === proto; // true
```
## `Object.create()`
> `Object.create(proto[,propertiesObject])`。第一个参数用于指定新创建对象的原型；第二个参数是新创建对象的属性名和属性描述符组成的对象。

> `proto`可以指定为`null`，意味着新对象原型是`null`，它不会继承`Object`的方法。

```js
var o;

// 创建一个原型为null的空对象
o = Object.create(null);

o = {};
// 以字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);

o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: { 
    writable:true,
    configurable:true,
    value: "hello" 
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() { return 10 },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
});

function Constructor(){}
o = new Constructor();
// 上面的一句就相当于:
o = Object.create(Constructor.prototype);
// 当然,如果在Constructor函数中有一些初始化代码,Object.create不能执行那些代码

// 创建一个以另一个空对象为原型,且拥有一个属性p的对象
o = Object.create({}, { p: { value: 42 } })

// 省略了的属性特性默认为false,所以属性p是不可写,不可枚举,不可配置的:
o.p = 24
o.p
//42

o.q = 12
for (var prop in o) {
   console.log(prop)
}
//"q"

delete o.p
//false

//创建一个可写的,可枚举的,可配置的属性p
o2 = Object.create({}, {
  p: {
    value: 42, 
    writable: true,
    enumerable: true,
    configurable: true 
  } 
});
```