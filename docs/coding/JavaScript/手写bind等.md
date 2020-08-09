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
    delete context.fn
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
- 判断调用者是否为函数
- 截取参数，有两种形式传参
- 返回一个函数，判断外部哪种方式调用了该函数（`new`|直接调用）

