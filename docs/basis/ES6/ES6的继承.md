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
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}
```
这个例子就是`ColorPoint`类继承`Point`类。

## `super关键字`
1. 在上面的例子中`super`关键字表示父类的构造函数，新建父类的this对象
