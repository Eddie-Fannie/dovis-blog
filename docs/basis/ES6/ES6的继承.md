# Class的继承

## 简介
> 不同于ES5利用原型实现继承的方式，ES6利用`extends`关键字实现继承。其实是寄生组合继承的语法糖
```js
class ColorPoint extends Point { // extends 相当于Son.prototype = Object.create(Father.prototype)
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x, y)  相当于Father.call(this)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString() super当作对象来使用
    }
}
```
这个例子就是`ColorPoint`类继承`Point`类。

::: tip
- 子类只要继承父类，可以不写`constructor`，一旦写了第一句就是`super`
:::

```js
class Person {
    constructor() {
        this.type = 'person'
    }
}

class Student extends Person {
    constructor() {
        super()
    }
}
var student1 = new Student() 
var person1 = new Person()
console.log(student1.type) // person
console.log(student1 instanceof Student) // true
console.log(student1 instanceof Person) // true
console.log(student1.hasOwnProperty('type')) // true
```

## `super关键字`
1. 在上面的例子中`super`关键字表示父类的构造函数，新建父类的`this`对象。相当于`Point.prototype.constructor.call(this)`
2. 子类没有`this`对象，所以必须在子类的构造方法中调用`super`方法，达到继承父类`this`对象的作用。
3. 在子类的构造函数中，只有调用`super`之后才可以使用`this`关键字，否则会报错。
4. 这个关键字可以当对象使用，也可以当函数使用，两种使用效果截然不同。第一点就是作为函数使用的情况；
5. `super()`内部的`this`指向的是子类。作为函数时，`super()`只能用在子类的构造函数中，用在其他地方会报错。
6. `super`作为对象时在普通方法中指向父类的原型对象；在静态方法中指向父类。
```js
class Parent {
    static myMethod(msg) {
        console.log('static', msg);
    }
    myMethod(msg) {
        console.log('instance',msg)
    }
}

class Child extends Parent {
    static myMethod(msg) {
        super.myMethod(msg); // super指向父类
    }
    myMethod(msg) {
        super.myMethod(msg); //super指向父类原型对象
    }
}
Child.myMethod(1) // staticc 1
var child = new Child();
child.myMethod(2); // instance 2
```
7. 由于`super`作为对象使用时指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过`super`调用的，即构造方法内的。**如果定义在父类的原型对象上，就可以取到**

```js
class A {
    constructor() {
        this.p = 2;
    }
}
class B extends A {
    get m () {
        return super.p;
    }
}
let b = new B();
b.m // undefined
```

例子二：
```js
class A {
    constructor() {
        this.x = 1;
    }
}
class B extends A {
    constructor() {
        super();
        this.x = 2;
        super.x = 3; // 读取super.x时，相当于读取A.prototype.x，所以返回undefined
        console.log(super.x); // undefined
        console.log(this.x); // 3
    }
}
let b = new B()
```
> 由于绑定子类的`this`，因此如果通过`super`对象某个属性赋值，这时`super`就是`this`，赋值的属性变成子类实例的属性。

## ES5继承和ES6继承的区别
> ES5的继承实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`)。ES6则是先创造父类的实例对象`this`（使用`super`），然后再用子类的构造函数修改`this`。

## 类的`prototype`属性和`__proto__`属性
> Class作为构造函数的语法糖，同时有`prototype`和`__proto__`属性，因此同时存在两条继承链：
+ 子类的`__proto__`属性表示构造函数的继承，总是指向父类
+ 子类的`prototype`属性的`__proto__`属性表示方法的继承，总是指向父类的`prototype`属性。
```js
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

造成上述两条继承链的原因是因为类的继承实现模式如下：
```js
class A {}
class B {}
// B的实例继承A的实例
Object.setPrototypeOf(B.prototype,A.prototype)；

// B的实例继承A的静态属性
Object.setPrototype(B, A);

const b = new B();
```
> 这两条继承链可以这样理解：作为一个对象，子类（B）的原型（`__proto__`属性）是父类A；作为一个构造函数，子类B的原型（`prototype`属性）是父类的实例。

## `extends`继承目标的特殊性
1. 子类继承`Object`类。
```js
class A extends Object {

}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
> 这种情况A其实就是构造函数`Object`的复制，A的实例就是`Object`的实例。

2. 不存在任何继承。
```js
class A {

}
A.__proto__ === Function.prototype // true
A.prototype.__proto === Object.prototype // true
```
> A作为一个基类（不存在任何继承）就是一个普通函数，所以直接继承`Function.prototype`。但是A调用后返回一个空对象（即`Object`的实例）。

3. 子类继承`null`。
```js
class A extends null {

}
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === undefined // true
```
> 和第二种情况类似，只是A调用后返回的对象不继承任何方法，实际相当于执行了：

```js
class C extends null {
    constructor() {
        return Object.create(null)
    }
}
```

## 实例的`__proto__`属性
> 子类实例的`__proto__`属性的`__proto__`属性指向父类实例的`__proto__`属性，也就是说子类的原型的原型是父类的原型。

## 原生构造函数的继承
::: tip
ES6允许继承原生构造函数定义子类，因为ES6先创建父类的实例对象`this`，然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。**所以`extends`也可以用来继承原生的构造函数**
:::

```js
class MyArray extends Array {
    constructor(...args) {
        super(...args)
    }
}
var arr = new MyArray();
arr[0] = 12;
arr.length // 1
arr.length = 0;
arr[0] // undefined

var brr = new MyArray(1,2,3)
console.log(brr) // [1,2,3]
```

## ES6继承转码为ES5
```js
class Person {
    constructor() {
        this.type = 'person'
    }
}

class Student extends Person {
    constructor() {
        super()
    }
}
```

利用`babel`在线转码结果：
```js
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; 
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { 
        _typeof = function _typeof(obj) { 
            return typeof obj; 
        }; 
    } else { 
        _typeof = function _typeof(obj) { 
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; 
        }; 
    } 
    return _typeof(obj); 
}

function _inherits(subClass, superClass) { 
    if (typeof superClass !== "function" && superClass !== null) { 
        throw new TypeError("Super expression must either be null or a function"); 
    } 
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); 
    if (superClass) _setPrototypeOf(subClass, superClass); 
}

function _setPrototypeOf(o, p) { 
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { 
        o.__proto__ = p; return o; 
    }; 
    return _setPrototypeOf(o, p); 
}

function _createSuper(Derived) { 
    var hasNativeReflectConstruct = _isNativeReflectConstruct(); 
    return function _createSuperInternal() { 
        var Super = _getPrototypeOf(Derived), result; 
        if (hasNativeReflectConstruct) { 
            var NewTarget = _getPrototypeOf(this).constructor; 
            result = Reflect.construct(Super, arguments, NewTarget); 
        } else { 
            result = Super.apply(this, arguments); 
        } 
        return _possibleConstructorReturn(this, result); 
    }; 
}

function _possibleConstructorReturn(self, call) { 
    if (call && (_typeof(call) === "object" || typeof call === "function")) { 
        return call; 
    } 
    return _assertThisInitialized(self); 
}

function _assertThisInitialized(self) { 
    if (self === void 0) { 
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); 
    } 
    return self; 
}

function _isNativeReflectConstruct() { 
    if (typeof Reflect === "undefined" || !Reflect.construct) return false; 
    if (Reflect.construct.sham) return false; 
    if (typeof Proxy === "function") return true; 
    try { 
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; 
    } catch (e) { 
        return false; 
    } 
}

function _getPrototypeOf(o) { 
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { 
        return o.__proto__ || Object.getPrototypeOf(o); 
    }; 
    return _getPrototypeOf(o); 
}

function _instanceof(left, right) { 
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { 
        return !!right[Symbol.hasInstance](left); 
    } else { 
        return left instanceof right; 
    } 
}

function _classCallCheck(instance, Constructor) { 
    if (!_instanceof(instance, Constructor)) { 
        throw new TypeError("Cannot call a class as a function"); 
    } 
}

var Person = function Person() {
  _classCallCheck(this, Person);

  this.type = 'person';
};

var Student = /*#__PURE__*/function (_Person) {
  _inherits(Student, _Person);

  var _super = _createSuper(Student);

  function Student() {
    _classCallCheck(this, Student);

    return _super.call(this);
  }

  return Student;
}(Person);
```

::: tip
`Student`函数为一个自执行函数，接收一个`Person`参数（就是要继承的父类）。返回一个构造函数`Student`。
:::