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
}
```
