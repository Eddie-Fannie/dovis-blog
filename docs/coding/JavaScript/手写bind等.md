# 手写call,apply,bind
## 手写`call`
- 首先`context`为可选参数，如果不传的话默认上下文为`window`;
- 接下来给`context`创建一个`fn`属性，并将值设置为需要调用的函数；
- 因为`call`可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来；
- 然后调用函数并将对象上的函数删除。

```js
// this为调用的函数
// context是参数对象
Function.prototype.myCall = function(context = window) {
    // 判断调用者是否为函数
    if(typeof this !== 'function') {
        throw new TypeError('Error')
    }
    context.fn = this
    const args = Array.from(arguments).slice(1) // 将需要传递的参数定义出来
    const result = context.fn(...args)
    delete context.fn // 仅仅是改掉this而不想新增一个方法，所以要删除掉
    return result;
}

// 改进
Function.prototype.myCall = function(context) {
    // 判断调用者是否为函数
    if(typeof this !== 'function') {
        throw new TypeError('Error')
    }

    // 注意：非严格模式下, 
    //   指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中就是 window 对象)
    //   值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象(用 Object() 转换）
    context = context ? Object(context) : window; 
  
    context.fn = this
    const args = Array.from(arguments).slice(1) // 将需要传递的参数定义出来
    const result = context.fn(...args)
    delete context.fn
    return result;
}
```

::: tip
```js
Function.prototype.myCall = function(context) {
    // step1: 把函数挂到目标对象上（这里的this就是我们要改造的那个函数）
    context.func = this
    // step2:执行函数
    context.func()
    // step3：删除step1中挂到目标对象上的函数
    delete context.func
}
```
补充传入参数：
```js
Function.prototype.myCall = function(context,...args) {
    context.func = this
    context.func(...args)
    delete context.func
}
```
:::

## 手写`apply`
因为`apply`传参是数组传参，所以取得数组，将其剥离为顺序参数进行函数调用
```js
Function.prototype.myApply = function (context,arr) {
    // 将函数设为对象的属性
    context = context ? Object(context) : window; 
    context.fn = this;
      
    let result
    // 执行该函数
    if(arr) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    // 删除该函数
    delete context.fn
    // 注意：函数是可以有返回值的
    return result;
  }
```
## 手写`bind`
- 指定`this`
- 传入参数
- 返回一个函数
- 函数柯里化
```js
Function.prototype.myBind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    const args = Array.from(arguments).slice(1) // 实现第二点
    const _this = this
    return function () { // 返回一个函数实现第三点
        // 实现第4点，这时的arguments是指bind返回的函数传入的参数
        // 即return function的参数
        var bindArgs = Array.prototype.slice.call(arguments)
        // 实现第一点
        return _this.apply(context, args.concat(bindArgs))
    }
}
function print(age, height) {
    console.log(age)
    console.log(this.name + ' ' +age + '' + height)
}
var obj = {
    name: 'linjiaheng'
}
let F = print.myBind(obj,1)
F()
let obj2 = new F(20)
```
![img](/dovis-blog/other/27.png)

运行结果 `this.name` 输出为 `undefined` ，这不是全局 `value` 也不是 `foo` 对象中的 `value` ，这说明 `bind` 的 `this` 对象失效了，`new` 的实现中生成一个新的对象，这个时候的 `this` 指向的是 `obj2` 。

> 一个绑定函数也能使用 `new` 操作符创建对象：这种行为就像把原函数当成构造器，提供的 `this` 值被忽略，同时调用时的参数被提供给模拟函数。

也可以通过修改返回函数的原型来实现：
```js
Function.prototype.bind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    
    // this 指向调用者
    var self = this;
    // 实现第2点，因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1);
    
    // 创建一个空对象
    var fNOP = function () {};
    
    // 实现第3点,返回一个函数
    var fBound = function () {
        // 实现第4点，获取 bind 返回函数的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 然后同传入参数合并成一个参数数组，并作为 self.apply() 的第二个参数
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
        // 注释1
    }
    
    // 注释2
    // 空对象的原型指向绑定函数的原型
    fNOP.prototype = this.prototype;
    // 空对象的实例赋值给 fBound.prototype
    fBound.prototype = new fNOP();
    return fBound;
}
```
::: tip
- 当作为构造函数时，`this` 指向实例，此时 `this instanceof fBound` 结果为 `true` ，可以让实例获得来自绑定函数的值
- 当作为普通函数时，`this` 指向`window` ，此时结果为 `false` ，将绑定函数的 `this` 指向 `context`

- 修改返回函数的 `prototype` 为绑定函数的 `prototype`，实例就可以继承绑定函数的原型中的值
- 至于为什么使用一个空对象 `fNOP` 作为中介，把 `fBound.prototype` 赋值为空对象的实例（原型式继承），这是因为直接 `fBound.prototype = this.prototype` 有一个缺点，修改 `fBound.prototype` 的时候，也会直接修改 `this.prototype` ；其实也可以直接使用ES5的 `Object.create()` 方法生成一个新对象，但 `bind` 和 `Object.create()` 都是ES5方法，部分IE浏览器（IE < 9）并不支
:::