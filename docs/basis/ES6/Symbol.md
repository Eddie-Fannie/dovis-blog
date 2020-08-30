# `Symbol`基本数据类型
1. `Symbol`值通过`Symbol`函数生成。可以接受一个**字符串**作为参数，表示对`Symbol`实例的描述。如果不加参数，控制台输出都是`Symbol()`，不利于区分。
```js
var s1 = Symbol('foo')
var s2 = Symbol('bar')

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // 'Symbol(foo)'
s2.toString() // 'Symbol(bar)'
```

2. `Symbol`值不能与其他类型的值进行运算，否则会报错。但是可以显示转为字符串。
3. `Symbol`值作为对象属性名不能使用点运算符。同样在对象内部使用`Symbol`值定义属性时，`Symbol`值必须放在方括号中。
4. `Symbol`作为属性名，该属性不会出现在`for...in/for...of`循环中，也不会被`Object.keys()/Object.getOwnPropertyNames()`返回。但也不是私有属性，可以利用`Object.getOwnPropertySymbols`方法可以获取指定对象的所有`Symbol`属性名，该方法返回一个数值，成员是该对象所有用作属性名的`Symbol`值。
5. 上述可以获得属性名的方法，还能使用`Reflect.ownKeys`方法可以返回所有类型的键名，包括常规键名和`Symbol`键名。以`Symbol`值作为名称的属性不会被常规方法遍历得到。我们可以利用这个特性为对象定义一些非私有但又希望只用于内部的方法
6. 有时候希望使用同一个`Symbol`值，`Symbol.for`方法可以左到这一点。接受一个字符串作为参数，然后搜索有没有以该参数作为名称的`Symbol`值。如果有就返回，否则就新建。
```js
var s1 = Symbol.for('foo')
var s2 = Symbol.for('foo')

s1 === s2   // true
```

## 内置`Symbol`值
> ES6内置的`Symbol`值，指向语言内部使用的方法。
1. `Symbol.hasInstance`
> 指向一个内部方法，对象使用`instanceof`运算符时会调用这个方法，判断该对象是否为某个构造函数的实例。
```js
class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}

[1,2,3] instanceof new MyClass // true

```

::: tip
上面的代码中，`MyClass`是一个类，`new MyClass()`会返回一个实例。该实例的`Symbol.hasInstance`方法会在进行`instanceof`运算时自动调用。
:::

2. `Symbol.isConcatSpreadable`
> 对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象使用`Array.prototype.concat()`时是否可以展开
```js
let arr2 = ['c','d'];
arr2[Symbol.isConcatSpreadable] = false;
['a','b'].concat(arr2, 'e') // ['a','b',['c','d'],'e']
```

3. `Symbol.species`
> 该属性指向当前对象的构造函数。创造实例默认会调用该方法，即使用这个属性返回的函数当作构造函数来创造新的实例对象。

4. `Symbol.match`
> 该属性会指向一个函数，当执行`str.match(myObject)`时，如果该属性存在，会调用它返回该方法的返回值。
```js
class MyMatcher {
    [Symbol.match](string) {
        return 'hello world'.indexOf(string)
    }
}
'e'.match(new MyMatcher())
```
5. `Symbol.replace`
> 当对象的`Symbol.replace`属性指向一个方法，当对象被`String.prototype.replace`方法调用时会返回该方法的返回值。

6. `Symbol.split`
7. `Symbol.iterator`
8. `Symbol.toPrimitive`
>对象的`Symbol.toPrimitive`属性指向一个方法，对象被转为原始类型的值会调用这个方法，返回该对象对应的原始类型的值。被调用时接收一个字符串参数，表示当前运算的模式。一共有3种模式。**优先级要高于`valueOf`、`toString`。对于`==`操作符，`hint`传递的值是`default`。**
- `Number`：该场合需要转成数值
- `String`：该场合需要转成字符串
- `Default`：该场合可以转成数值，也可以转成字符串。

```js
let obj = {
    [Symbol.toPrimitive](hint) {
        switch(hint) {
            case 'number':
                return 123;
            case 'string':
                return 'str';
            case 'default':
                return 'default';
            default:
                throw new Error()
        }
    }
}
2*obj // 246
3+obj //3default
obj == 'default' // true
String(obj) // 'str'
```

**例子2：**
```js
const a = {}
a[Symbol.toPrimitive] = (hint) => {
    if (hint == 'number') return 1
    if (hint == 'string') return 2
    return 3
}
a.valueOf = () => 4
a.toString = () => 5
console.log(a == 1, a == 2, a == 3, a == 4, a == 5) // false, false, true, false, false
```

9. `Symbol.toStringTag`
10. `Symbol.unscopables`
11. `Symbol.search`