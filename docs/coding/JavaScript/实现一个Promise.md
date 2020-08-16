# 实现一个Promise
```js
// 三种状态
const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'

// Promise构造函数
function myPromise() {
    const that = this;// 回调时保证正确的this对象
    that.state = PENDING
    that.value = null; //用于保存回调函数resolve/reject传递的参数值
    that.resolveCallbacks = [] // 用于保存then的回调
    that.rejectCallbacks = []

    // resolve/reject
    function resolve(value) {
        if(that.state === PENDING) {
            that.state === RESOLVE
            that.value = value
            that.resolveCallbacks.map(cb => cb(that.value))
        }
    }
    function reject(value) {
        if(that.state === PENDING) {
            that.state === REJECT
            that.value = value
            that.rejectCallbacks.map(cb => cb(that.value))
        }
    }
    // 实现如何执行Promise中传入的函数
    try {
        fn(resolve, reject)
    } catch(e) {
        reject(e)
    }
}

// 实现then函数
myPromise.prototype.then = function(onResolved, onRejected) {
    const that = this;
    // 判断两个参数是否为函数类型。如果不是就创建一个函数赋值给对应的参数
    onResolved = typeof onResolved === 'function' ? onResolved : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r}

    // 判断当前状态
    if(that.state === PENDING) {
        that.resolvedCallbacks.push(onResolved)
        that.rejectedCallbacks.push(onRejected)
    }
    if(that.state === RESOLVE) {
        onResolved(that.value)
    }
    if(that.state === REJECT) {
        onRejected(that.value)
    }
}

new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    },0)
}).then(value => {
    console.log(value)
})
```