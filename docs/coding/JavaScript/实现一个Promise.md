# 手写一个Promise

## 基础版本
```js
function MyPromise(fn) {
    let self = this // 缓存当前promise实例
    self.value = null; // 成功时的值
    self.error = null; // 失败时的原因
    self.onFulfilled = null; // 成功的回调函数
    self.onRejected = null; // 失败的回调函数

    function resolve(value) {
        self.value = value;
        self.onFulfilled(self.value) // resolve时执行的成功回调
    }

    function reject(error) {
        self.error = error;
        self.onRejected(self.error) // reject时执行失败回调
    }
    fn(resolve,reject)
}

MyPromise.prototype.then = function(onFulfilled,onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected
}
module.exports = MyPromise
```

## 支持同步任务
> 我们在使用es6 的`promise`时，可以传入一个异步任务，也可以传入一个同步任务，但是我们的上面基础版代码并不支持同步任务，这样会报错：
```js
let promise = new Promise((resolve, reject) => {
    resolve("同步任务执行")
});
```
因为是同步任务，所以当我们的`promise`实例`reslove`时，它的`then`方法还没执行到，所以回调函数还没注册上，这时`reslove`中调用成功回调肯定会报错的。

所以上述的基础代码优化成：
```js
function resolve(value) {
    //利用setTimeout特性将具体执行放到then之后
    setTimeout(() => {
        self.value = value;
        self.onFulfilled(self.value)
    })
}

function reject(error) {
    setTimeout(() => {
        self.error = error;
        self.onRejected(self.error)
    })
}
```

## 实现状态
1. 实现三种状态
2. 状态从`pending`-->`fulfilled`和`pending`-->`rejected`
3. 实现一旦`promise`状态发生改变，再对`promise`对象添加回调函数，也会立即得到这个结果。
```js
// 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPromise(fn) {
    let self = this // 缓存当前promise实例
    self.value = null; // 成功时的值
    self.error = null; // 失败时的原因
    self.status = PENDING // 新增状态
    self.onFulfilled = null; // 成功的回调函数
    self.onRejected = null; // 失败的回调函数

    function resolve(value) {
         //如果状态是pending才去修改状态为fulfilled并执行成功逻辑
         if (self.status === PENDING) {
            setTimeout(function() {
                self.status = FULFILLED;
                self.value = value;
                self.onFulfilled(self.value);
            })
        }
    }

    function reject(error) {
        //如果状态是pending才去修改状态为rejected并执行失败逻辑
        if (self.status === PENDING) {
            setTimeout(function() {
                self.status = REJECTED;
                self.error = error;
                self.onRejected(self.error);
            })
        }
    }
    fn(resolve,reject)
}

MyPromise.prototype.then = function(onFulfilled,onRejected) {
    if (this.status === PENDING) {
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
    } else if (this.status === FULFILLED) {
        //如果状态是fulfilled，直接执行成功回调，并将成功值传入
        onFulfilled(this.value)
    } else {
        //如果状态是rejected，直接执行失败回调，并将失败原因传入
        onRejected(this.error)
    }
}
module.exports = MyPromise
```

## 支持链式调用
想支持链式调用首先存储回调要改为使用数组
```js
self.onFulfilledCallbacks = [];
self.onRejectedCallbacks = [];
```

当然执行回调时，也要改成遍历回调数组执行回调函数
```js
self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
```

最后，`then`方法也要改一下,只需要在最后一行加一个`return this`即可
```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    .....
    return this;
}
```

## 支持串行异步任务
> 如何既能保持这种链式写法的同时又能使异步操作衔接执行呢？我们其实让`then`方法最后不再返回自身实例，而是返回一个新的`promise`即可
```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    let bridgePromise;
    //防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
    if (self.status === FULFILLED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        })
    }
    if (self.status === REJECTED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status === PENDING) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            self.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push((error) => {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
//catch方法其实是个语法糖，就是只传onRejected不传onFulfilled的then方法
MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}
//用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
function resolvePromise(bridgePromise, x, resolve, reject) {
   //如果x是一个promise
    if (x instanceof MyPromise) {
        //如果这个promise是pending状态，就在它的then方法里继续执行resolvePromise解析它的结果，直到返回值不是一个pending状态的promise为止
        if (x.status === PENDING) {
            x.then(y => {
                resolvePromise(bridgePromise, y, resolve, reject);
            }, error => {
                reject(error);
            });
        } else {
            x.then(resolve, reject);
        }
        //如果x是一个普通值，就让bridgePromise的状态fulfilled，并把这个值传递下去
    } else {
        resolve(x);
    }
}
```
::: tip
首先，为防止使用者不传成功回调函数或不失败回调函数，我们给了默认回调函数，然后无论当前`promise`是什么状态，我们都返回一个`bridgePromise`用来衔接后续操作。

另外执行回调函数时,因为回调函数既可能会返回一个异步的`promise`也可能会返回一个同步结果，所以我们把直接把回调函数的结果托管给`bridgePromise`，使用`resolvePromise`方法来解析回调函数的结果，如果回调函数返回一个`promise`并且状态还是`pending`，就在这个`promise`的`then`方法中继续解析这个`promise` `reslove`传过来的值，如果值还是`pending`状态的`promise`就继续解析，直到不是一个异步`promise`，而是一个正常值就使用`bridgePromise`的`reslove`方法将`bridgePromise`的状态改为`fulfilled`，并调用`onFulfilledCallbacks`回调数组中的方法，将该值传入，到此异步操作就衔接上了。
:::

**完整的`Promise/A+`**

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
    const self = this;
    self.value = null;
    self.error = null;
    self.status = PENDING;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = FULFILLED;
                self.value = value;
                self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
            }, 0)
        }
    }

    function reject(error) {
        if (self.status === PENDING) {
            setTimeout(function() {
                self.status = REJECTED;
                self.error = error;
                self.onRejectedCallbacks.forEach((callback) => callback(self.error));
            }, 0)
        }
    }
    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

function resolvePromise(bridgepromise, x, resolve, reject) {
    //2.3.1规范，避免循环引用
    if (bridgepromise === x) {
        return reject(new TypeError('Circular reference'));
    }
    let called = false;
    //这个判断分支其实已经可以删除，用下面那个分支代替，因为promise也是一个thenable对象
    if (x instanceof MyPromise) {
        if (x.status === PENDING) {
            x.then(y => {
                resolvePromise(bridgepromise, y, resolve, reject);
            }, error => {
                reject(error);
            });
        } else {
            x.then(resolve, reject);
        }
        // 2.3.3规范，如果 x 为对象或者函数
    } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            // 是否是thenable对象（具有then方法的对象/函数）
            //2.3.3.1 将 then 赋为 x.then
            let then = x.then;
            if (typeof then === 'function') {
            //2.3.3.3 如果 then 是一个函数，以x为this调用then函数，且第一个参数是resolvePromise，第二个参数是rejectPromise
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(bridgepromise, y, resolve, reject);
                }, error => {
                    if (called) return;
                    called = true;
                    reject(error);
                })
            } else {
            //2.3.3.4 如果 then不是一个函数，则 以x为值fulfill promise。
                resolve(x);
            }
        } catch (e) {
        //2.3.3.2 如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝。
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    let bridgePromise;
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
    if (self.status === FULFILLED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }, 0);
        })
    }
    if (self.status === REJECTED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }, 0);
        });
    }
    if (self.status === PENDING) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            self.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push((error) => {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}
// 执行测试用例需要用到的代码
MyPromise.deferred = function() {
    let defer = {};
    defer.promise = new MyPromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
try {
    module.exports = MyPromise
} catch (e) {}
```

## 实现`promise`的`all race resolve reject`
```js
MyPromise.all = function(promises) {
    return new MyPromise(function(resolve, reject) {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                result[i] = data;
                if (++count == promises.length) {
                    resolve(result);
                }
            }, function(error) {
                reject(error);
            });
        }
    });
}

MyPromise.race = function(promises) {
    return new MyPromise(function(resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            });
        }
    });
}

MyPromise.resolve = function(value) {
    return new MyPromise(resolve => {
        resolve(value);
    });
}

MyPromise.reject = function(error) {
    return new MyPromise((resolve, reject) => {
        reject(error);
    });
}
```
::: tip
`all`的原理就是返回一个`promise`，在这个`promise`中给所有传入的`promise`的`then`方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个`promise`去`reslove`，把结果数组返回出去，`race`和`all`大同小异，只不过它不会等所有`promise`都成功，而是谁快就把谁返回出去
:::