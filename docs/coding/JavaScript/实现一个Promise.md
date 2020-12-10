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
    },0)
}

function reject(error) {
    setTimeout(() => {
        self.error = error;
        self.onRejected(self.error)
    },0)
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
    self.value = null;//初始值
    self.error = null;
    self.status = PENDING;//初始状态
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

## 自己手写版本
```js
function myPromise(excutor) {
    var self = this
    self.status = 'pending'
    self.data = undefined
    self.callbacks = []  // 每个元素的结构：{onResolved(){}，onRejected(){}}
    function resolve(value) {
        if(self.status !== 'pending') return;
        //执行callbacks里的函数，并保存data,并将当前promise状态改为resolved
        self.status = 'resolved'
        self.data = value
        if(self.callbacks.length > 0) {
            self.callbacks.forEach(callbackObj => {
                callbackObj.onResolved(value)
            });
        }
    }
    function reject(value) {
        if(self.status !== 'pending') return;
        self.status = 'rejected'
        self.data = value
        if(self.callbacks.length > 0) {
            self.callbacks.forEach(callbackObj => {
                callbackObj.onRejected(value)
            })
        }
    }
    // 实现当在执行excutor的时候，执行异常时直接执行reject方法
    try {
        excutor(resolve,reject)
    } catch (error) {
        reject(error)
    }
   
}
myPromise.prototype.then = function(onResolved,onRejected){
    onResolved = typeof onResolved === 'function'? onResolved: value => value
    onRejected = typeof onRejected === 'function'? onRejected: reason => {throw reason}

    var self = this

    return new myPromise((resolve,reject)=>{
       /*
        调用指定回调函数的处理，根据执行结果。改变return的promise状态
         */
        function handle(callback) {
            try{
                const result = callback(self.data)
                if (result instanceof myPromise){
                    // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
                    result.then(
                        value => {resolve(value)},
                        reason => {reject(reason)}
                    )
                } else {
                    // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
                    resolve(result)
                }
            }catch (e) {
                //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
                reject(e)
            }
        }
        if(self.status === 'pending'){
            // promise当前状态还是pending状态，将回调函数保存起来
            self.callbacks.push({
                onResolved(){
                    handle(onResolved)
                },
                onRejected(){
                    handle(onRejected)
                }
            })
        }else if(self.status === 'resolved'){
            setTimeout(()=>{
                handle(onResolved)
            })
        }else{ // 当status === 'rejected'
            setTimeout(()=>{
                handle(onRejected)
            })
        }
    })

}

myPromise.prototype.catch = function(onRejected) {
    // catch方法的作用跟then里的第二歌回调函数一样
    return this.then(undefined,onRejected)
}
myPromise.resolve = function(value) {
 // 可以传入成功状态的promise/失败的promise/不是promise
 return new myPromise((resolve,reject) => {
    if(value instanceof myPromise) {
        value.then(
            value => {resolve(value)},
            reason => {reject(reason)}
        )
    } else {
        resolve(value)
    }
 })
}
myPromise.reject = function(reason) {
    // 返回一个状态rejected的promise即可
    return new myPromise((resolve,reject) => {
        reject(reason)
    })
}
myPromise.all = function(promises) {
    const values = new Array(promises.length)
    var resolvedCount = 0 //计状态为resolved的promise的数量
    return new myPromise((resolve,reject) => {
        // 遍历promises，获取每个promise的结果
        promises.forEach((p,index) => {
            // promises数组不一定都是promise对象，所以要利用resolve包装一下
            myPromise.resolve(p).then(
                value => {
                    // p状态为resolved，将值保存起来
                    values[index] = value
                    resolvedCount++;
                    // 如果全部p都为resolved状态，return的promise状态为resolved
                    if(resolvedCount === promises.length){
                        resolve(values)
                    }
                },
                reason => {
                    //只要有一个失败，return的promise状态就为reject
                    reject(reason)
                }
            )
        })
    })
}
myPromise.race = function(promises) {
    return new myPromise((resolve,reject) => {
        promises.forEach((p,index) => {
            myPromise.resolve(p).then(
                value => {
                    // 只要有一个成功，返回的promise的状态九尾resolved
                    resolve(value)
                },
                reason => { //只要有一个失败，return的promise状态就为reject
                    reject(reason)
                }
            )
        })
    })
}

myPromise.allSettled = function(promises) {
    return myPromise.all(promises.map(p => myPromise.resolve(p)
        .then(value => ({
            status: 'resolved',
            value
        }), reason => ({
            status: 'rejected',
            reason
        }))
    ))
}

myPromise.prototype.finally = function(fn) {
    return this.then(value => {
       fn();
       return value;
    }, reason => {
        fn();
        throw reason;
    });
};
```

## 修言课程版本
一个`Promise`应该具备的基本特征：
- 可以接收一个`executor`作为入参
- 具备`pending/resolved/rejected`这三种状态

```js
function CutePromise(executor) {
    // value记录异步任务成功的执行结果
    this.value = null;
    // reason记录异步任务失败的原因
    this.reason = null;
    // status记录当前状态，初始状态为pending
    this.status = 'pending'
    var self = this;

    //定义resolve函数
    function resolve(value) {
        //异步任务成功后，把结果赋值给value
        self.value = value
        // 将当前状态切换为resolved
        self.status = 'resolved'
    }
    function reject(reason) {
        self.reason = reason
        self.status = 'rejected'
    }
    executor(resolve,reject)
}

// then
CutePromise.prototype.then = function(onResolved,onRejcted) {
    // 必须为函数，不然透传来兜底
    if(typeof onResolved !== 'function') {
        onResolved = function(x) {
            return x
        }
    }
    if(typeof onRejected !== 'function') {
        onRejected = function(e) {
            throw e
        }
    }
    var self = this;
    if(self.status === 'resolved') {
        onResolved(self.value)
    } else if(self.status === 'rejected') {
        onRejected(self.reason);
    }
}
```

链式调用：
- `then`方法中应该直接把`this`给`return`出去，链式调用常规操作
- 链式调用允许我们多次调用`then`,多个`then`中传入的`onResolved`和`onRejected`任务，我们需要维护在一个队列中；
- 要想办法确保`then`方法执行的时机，务必在`onResolved/onRejected`队列批量执行前。不然队列任务批量执行的时候，任务本身都还没收集完。
```js
function CutePromise(executor) {
    this.value = null;
    this.reason = null;
    this.status = 'pending'
    this.onResolvedQueue = []
    this.onRejectedQueue = []

    var self = this
    function resolve(value) {
        if(self.status !== 'pending') {
            return
        }
        self.value = value;
        self.status = 'resolved'
        setTimeout(function() {
            self.onResolvedQueue.forEach(resolved => resolved(self.value))
        }) // 时间没传，默认0
    }

    function reject(reason) {
        if(self.status !== 'pending') return;
        self.reason = reason
        self.status = 'rejected'
        setTimeout(function(){
            self.onRejectedQueue.forEach(rejected => rejected(self.reason))
        })
    }
    executor(resolve,reject)
}

CutePromise.prototype.then = function(onResolved,onReject) {
    if(typeof onResolved !== 'function') {
        onResolved = function(x) {
            return x;
        }
    }
    if(typeof onRejected !== 'function') {
        onRejected = function(e) {
            throw e
        }
    }
    var self = this;
    if(self.status === 'resolved') {
        onResolved(self.value)
    } else if(self.status === 'rejected') {
        onRejected(self.reason);
    } else if(self.status === 'pending') {
        self.onResolvedQueue.push(onResolved)
        self.onRejectedQueue.push(onRejected)
    }
    return this;
}
```