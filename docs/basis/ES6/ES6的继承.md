# Class的继承

## 简介
> 不同于ES5利用原型实现继承的方式，ES6利用`extends`关键字实现继承
```js
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x, y)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString() super当作对象来使用
    }
}
```
这个例子就是`ColorPoint`类继承`Point`类。

## `super关键字`
1. 在上面的例子中`super`关键字表示父类的构造函数，新建父类的this对象。相当于`Point.prototype.constructor.call(this)`
2. 子类没有this对象，所以必须在子类的构造方法中调用super方法，达到继承父类this对象的作用。
3. 在子类的构造函数中，只有调用super之后才可以使用this关键字，否则会报错。
4. 这个关键字可以当对象使用，也可以当函数使用，两种使用效果截然不同。第一点就是作为函数使用的情况；
5. super()内部的this指向的是子类。作为函数时，super()只能用在子类的构造函数中，用在其他地方会报错。
6. super作为对象时在普通方法中指向父类的原型对象；在静态方法中指向父类。
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
7. 由于super作为对象使用时指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过super调用的，即构造方法内的。**如果定义在父类的原型对象上，就可以取到**

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
> 由于绑定子类的`this`，因此如果通过`super`对象某个属性赋值，这时super就是this，赋值的属性变成子类实例的属性。

## ES5继承和ES6继承的区别
> ES5的继承实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（`Parent.apply(this)`)。ES6则是先创造父类的实例对象this（使用super），然后再用子类的构造函数修改this。

## 类的`prototype`属性和`__proto__`属性
> Class作为构造函数的语法糖，同时有`prototype`和`__proto__`属性，因此同时存在两条继承链：
+ 子类的__proto__属性表示构造函数的继承，总是指向父类
+ 子类的prototype属性的__proto__属性表示方法的继承，总是指向父类的prototype属性。
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
> 这两条继承链可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类A；作为一个构造函数，子类B的原型（prototype属性）是父类的实例。

## extends继承目标的特殊性
1. 子类继承Object类。
```js
class A extends Object {

}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
> 这种情况A其实就是构造函数Object的复制，A的实例就是Object的实例。

2. 不存在任何继承。
```js
class A {

}
A.__proto__ === Function.prototype // true
A.prototype.__proto === Object.prototype // true
```
> A作为一个基类（不存在任何继承）就是一个普通函数，所以直接继承`Function.prototype`。但是A调用后返回一个空对象（即Object的实例）。

3. 子类继承null。
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

## 实例的__proto__属性
> 子类实例的__proto__属性的__proto__属性指向父类实例的__proto__属性，也就是说子类的原型的原型是父类的原型。

## 原生构造函数的继承
::: tip
ES6允许继承原生构造函数定义子类，因为ES6先创建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。**所以extends也可以用来继承原生的构造函数**
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