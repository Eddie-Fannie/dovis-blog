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