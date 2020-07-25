# js面试问题列表

## 初级题

1. **深浅拷贝的原理及实现拷贝**
> [js对象的深浅拷贝](/dovis-blog/basis/JavaScript/对象深浅拷贝)

2. **为什么0.1+0.2 != 0.3**
> 因为JS采用IEEE 754双精度版本。计算机中所有数据都是以二进制存储的，然后再计算结果转换成十进制。所以这个问题就是二进制精度发生了丢失

**解决精度丢失导致结果不精确**
```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```
**测试两个浮点数有没有丢失精确度**
```js
function judgeFloat(n, m) {
    const binaryN = n.toString(2);
    const binaryM = m.toString(2);
    console.log(`${n}的二进制是    ${binaryN}`);
    console.log(`${m}的二进制是    ${binaryM}`);
    const MN = m + n;
    const accuracyMN = (m * 100 + n * 100) / 100;
    const binaryMN = MN.toString(2);
    const accuracyBinaryMN = accuracyMN.toString(2);
    console.log(`${n}+${m}的二进制是${binaryMN}`);
    console.log(`${accuracyMN}的二进制是    ${accuracyBinaryMN}`);
    console.log(`${n}+${m}的二进制再转成十进制是${to10(binaryMN)}`);
    console.log(`${accuracyMN}的二进制是再转成十进制是${to10(accuracyBinaryMN)}`);
    console.log(`${n}+${m}在js中计算是${(to10(binaryMN) === to10(accuracyBinaryMN)) ? '' : '不'}准确的`);
}
  function to10(n) {
    const pre = (n.split('.')[0] - 0).toString(2);
    console.log(pre)
    const arr = n.split('.')[1].split('');
    console.log(arr)
    let i = 0;
    let result = 0;
    while (i < arr.length) {
      result += arr[i] * Math.pow(2, -(i + 1));
      i++;
    }
    console.log(result)
    return result;
  }
  judgeFloat(0.1,0.2)
```

3. **下列输出原因：**
```js
console.log(Object instanceof Function) // true
console.log(Function instanceof Object) // true
```
> 构造函数本身又是方法(`Function`)的实例 --> `Function`是通过自己创建出来的,`Function`的`__proto__`指向的`Function.prototype`。`Object`实际上也是通过`Function`创建出来的。所以那么`Object`的`__proto__`指向的是`Function.prototype`--> **验证第一小题正确**；因为`JS`中所有的东西都是对象，那么`Function.prototype`也是对象，既然是对象，那么`Function.prototype`肯定是通过`Object`创建出来的。--> **验证第二小题正确**

综上所述，Function和Object的原型以及原型链的关系可以归纳为下图:
![img](/dovis-blog/js/function.jpg)
## 中级题
1. **在JavaScript文件开头包含`use strict`意义**
+ 严格模式的好处：
  - **使调试更容易。** 如果代码错误本来会被忽略或失败，那么现在将会产生错误或抛出异常，从而更快地发现代码中的问题，并更快地指引它们的源代码。
  - **防止意外全局** 如果没有严格模式，将值赋给未声明的变量会自动创建一个具有该名称的全局变量。这是`JavaScript`中最常见的错误之一。在严格模式下，尝试这样做会引发错误。
  - **消除隐藏威胁** 在没有严格模式的情况下，对`null`或`undefined`的这个值的引用会自动强制到全局。这可能会导致许多`headfakes`和`pull-out-your-hair`类型的错误。在严格模式下，引用`null`或`undefined`的这个值会引发错误。
  - **不允许重复的参数值** 严格模式在检测到函数的重复命名参数（例如，函数`foo（val1，val2，val1）{}）`时会引发错误，从而捕获代码中几乎可以肯定存在的错误，否则您可能会浪费大量的时间追踪。
  - **抛出无效的使用错误的删除符** 删除操作符（用于从对象中删除属性）不能用于对象的不可配置属性。当试图删除一个不可配置的属性时，非严格代码将自动失败，而在这种情况下，严格模式会引发错误。
  - **使用`eval()`更安全**  `eval()`在严格模式和非严格模式下的行为方式有些不同。最重要的是，在严格模式下，在`eval()`语句内部声明的变量和函数不会在包含范围中创建。
  
## 高级题