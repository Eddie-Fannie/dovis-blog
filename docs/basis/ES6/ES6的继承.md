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
> 
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


