# Promise对象
>`Promise`对象是一个代理对象。它接受传入的`executor`作为入参，允许你把异步任务的成功和失败分别绑定到对应的处理方法上去。

::: tip
异步编程四种方式
1. 回调函数（最基本的方法，把B写成A的回调函数）、
2. 事件监听（为A绑定事件，当A发生某个事件，就执行B）、
3. 发布/订阅
4. 本文要介绍的`Promise`对象。
:::
> `Promise` 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。可以为异步操作的成功和失败绑定执行函数，让异步方法可以像同步方法一样返回值，但立即返回的是一个能代表未来可能出现结果的`Promise`对象。

`Promise`对象有两个特点：
- 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有3种状态：`Pending`（进行中）,`Fulfilled`（已成功）和`Rejected`（已失败）。只有异步操作的结果可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
- 一旦状态改变就不会再变，任何时候都可以得到这个结果。`Promise`对象状态改变只有两种可能：`pending-->Fulfilled`和从`Pending-->Rejected`
- 只有异步操作的结果可以决定当前是哪一种状态。一旦状态改变就不会再变，再对`Promise`对象添加回调函数，也会立即得到结果。

`Promise`缺点：
- 无法取消，一旦新建就会**立即执行**，无法中途取消。
- 不设置回调函数，`Promise`内部抛出的错误不会反应到外部。
- 当处于`Pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

```js
function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done')
    }) // new Promise构造函数内的回调同步执行
}
timeout(100).then((value) => {
    console.log(value) // done
}) // then的回调函数是异步执行的
```
> `resolve`函数的作用是将`Promise`对象的状态从未完成变为成功（即从`pending`变为`Resolved`），在异步操作时调用，并将异步操作的结果作为参数传递出去。`reject`函数的作用是将`Promise`对象的状态从未完成变为失败，在异步操作失败时调用，并将异步操作报出的错误作为参数传递出去。

::: tip
`Promise`实例生成以后，可以`then`方法分别指定`Resolved/Rejected`状态的回调函数。第二个参数为可选

`resolve`函数的参数除了正常值外还可能是另外一个`Promise`实例。如果把`p1`作为参数传给`p2`实例，此时`p1`的状态会传递给`p2`。如果`p1`的状态是`Pending`，那么`p2`的回调函数会等待`p1`状态改变；如果`p1`状态已经是`Resolved/Rejected`，那么`p2`的回调函数将立刻执行。
:::

```js
let promise = new Promise((resolve,reject) => {
    console.log('Promise')
    resolve()
})
promise.then(() => console.log('Resolved'))
console.log('hi')
// Promise hi Resolved
```
1. `Promise`对象新建完立即执行
2. `then`方法指定的回调函数将在当前脚本所有同步任务执行完成后才执行。**尽管调用 `then` 方法时，`Promise` 已经处于 `fulfilled` 状态，但 `then` 方法的 `onFulfilled` 回调函数不会立即执行，而是进入 `microtask` 队列等待执行。**
> 传递给 `new Promise` 的是 `executor` 执行器。当 `Promise` 被创建的时候，`executor` 会立即同步执行。`executor` 函数里通常做了 `2` 件事情：初始化一个异步行为和控制状态的最终转换。

**调用`resolve`或者`reject`并不会终结`Promise`的参数函数的执行**
```js
new Promise((resolve, reject) => {
    resolve(1)
    console.log(2)
}).then(r => {
    console.log(1)
})
// 2
// 1
```
> 一般来说，调用`resolve`或者`reject`以后，`Promise`的使命就完成了，后继操作应该放到`then`方法里面，而不应该直接写在`resolve`或`reject`后面。所以，最好在它们前面加上`return`语句，这样不会产生意外，不过这样后面的语句就自然不会执行。

## Promise原型对象上的方法
`Promise.prototype.then()/Promise.prototype.catch()`

### `then`
`then`方法第一个参数是`Resolved`状态的回调函数，第二个参数（可选）是`Rejected`状态的回调函数。**如果给`then()`函数传递来了非函数参数则会默认忽略**
> 可以采用链式写法，调用多个`then`，返回一个新的`Promise`实例。第一个`then`回调完成后会将返回的结果作为参数传入第二个`then`。**在`then`中使用`return`，那么`return`的值会被`Promise.resolve()`包装**
```js
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
```

::: tip
`Promise.prototype.then()` 将用于为 `Promise` 实例添加处理程序的函数。它接受 `2` 个可选的参数：
- `onResolved`：状态由`pending`转换成`fulfilled`时执行。
- `onRejected`：状态由`pending`转换成`rejected`时执行。

```js
function onResolved(res) {
    console.log('resolved' + res)
}
function onRejected(err) {
    console.log('reject'+err)
}
new Promise((resolve,reject) => {
    resolve(3)
}).then(onResolved,onRejected)
```
`then`返回的新实例`Promise`会基于`onResolved`的返回值进行构建，构建的时候其实是把返回值传递给`Promise.resolve()`生成的新实例。如果`.then()`没有提供`onResolved`这个处理程序，则`Promise.resolve()`会基于上一个实例`resolve`后的值来初始化一个新的实例。

```js
let p1 = new Promise((resolve, reject) => {
    resolve(3)
})
let p2 = p1.then()
setTimeout(console.log, 0, p2)  // Promise {<fulfilled>: 3}
```

如果`onResolved`处理程序没有返回值，那么返回的新实例的内部值会是`undefined`：
```js
let p1 = new Promise((resolve, reject) => {
    resolve(3)
})
let p2 = p1.then(() => {})
setTimeout(console.log, 0, p2)  // Promise {<fulfilled>: undefined}
```

如果在`onResolved`处理程序里抛出异常，则会返回一个新的`rejected`状态的`Promise`：
```js
let p1 = new Promise((resolve, reject) => {
    resolve(3)
})
let p2 = p1.then(() => {
    throw new Error('这是一个错误')}
)
setTimeout(console.log, 0, p2)  // Promise {<rejected>: 这是一个错误}
```
:::

```js
// 给then传递非函数的参数会被忽视，发生Promise的值穿透问题
Promise.resolve(1)
    .then(Promise.resolve(2))
    .then(3)
    .then()
    .then(console.log)
// 1
```

### `catch`
> 该方法是`.then(null, rejection)`别名，用于指定发生错误时的回调。`then`方法指定的回调函数如果在运行中抛出错误，也会被`catch`方法捕获。

`reject`方法等同于抛出错误
例子：
```js
var p1 = new Promise((resolve, reject) => {
 throw new Error('test')
})
p1.catch(error => {
    console.log(error)
})
// Error: test

// 上面写法等同于
var p1 = new Promise((resolve, reject) => {
 try{
    throw new Error('test')
 } catch (e) {
    reject(e)
 }
})
p1.catch(error => {
    console.log(error)
})

// 等同于2
var p1 = new Promise((resolve, reject) => {
    reject(new Error('test'))
})
p1.catch(error => {
    console.log(error)
})
```
::: tip
1. `Promise`在`resolve`语句后面再抛出错误，并不会被捕获，等于没有抛出。因为`Promise`状态一旦改变，就会永久保持该状态，不会再改变。
2. 和传统的`try...catch`代码块不同的是，如果没有使用`catch`方法指定错误处理的回调函数，`Promise`对象抛出的错误不会传递到外层代码，即不会有任何反应。
3. `catch`方法返回的还是一个`Promise`对象，因此后面还可以接着调用`then`方法。如果没有捕获到错误就直接跳过`catch`执行后面的`then`语句，不过这个时候的捕获错误就和前面的`catch`无关了。
4. `catch`方法中还能抛出错误。如果后面没有别的`catch`方法，导致这个错误不会被捕获，也不会传递到外层。可以采用链式调用`catch`来捕获前面一个`catch`抛出的错误。

基于`onRejected`的返回值也会返回一个新的`Promise`，而且处理逻辑也是一样的，也是通过把返回值传递给`Promise.resolve()`产生一个新的实例。
```js
let p1 = new Promise((resolve, reject) => {
    reject(3)
})

// 没有 `onRejected` 处理程序时，会原样向后传，不过是新实例
let p2 = p1.then(() => {})  s
setTimeout(console.log, 0, p2)  // Promise {<rejected>: 3}

// 返回值为undefined时
let p3 = p1.then(null, () => {})
setTimeout(console.log, 0, p3)  // Promise {<fulfilled>: undefined}

// 返回值有实际值的时候
let p4 = p1.then(null, () => 6)
setTimeout(console.log, 0, p4)  // Promise {<fulfilled>: 6} 保证后续链式调用时可以继续下去，状态就为fulfilled

// 当返回值是Promise时，会保留当前Promise
let p5 = p1.then(null, () => Promise.reject())
setTimeout(console.log, 0, p5)  // Promise {<rejected>: undefined}

// 当遇到一个错误的时候
let p6 = p1.then(null, () => {
    throw new Error('error')
})
setTimeout(console.log, 0, p6)  // Promise {<rejected>: error}

// 当返回值是一个错误时
let p7 = p1.then(null, () => new Error('error'))
setTimeout(console.log, 0, p7)  // Promise {<fulfilled>: Error: error}
```
:::

> 实例`resolve()`的时候，状态由`pending`变成`rejected`，从而调用`onRejected`进行处理，但是为什么有时候会返回一个`fulfilled`的新实例呢？试着想一下，如果`onRejected`返回了一个`pending`的或者`rejected`状态的新实例，那后续的链式调用就进行不下去了。

```js
new Promise((resolve, reject) => {
    reject()
}).then(null, () => {
    console.log('A')
}).then(() => {
    console.log('B')
}).then(() => {
    console.log('C')
}).catch(() => {
    console.log('D')
})
```
> `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值穿透。值传透可以理解为，当传入`then`的不是函数的时候，这个`then`是无效的。而实际原理上其实是当`then`中传入的不算函数，则这个`then`返回的`promise`的`data`，将会保存上一个的`promise.data`。这就是发生值穿透的原因。而且每一个无效的`then`所返回的`promise`的状态都为`resolved`。

```js
let promise = new Promise((resolve,reject)=>{
    resolve(1)
})
promise
  .then(2)
  .then(3)
  .then(value =>console.log(value))

// 输出1
```

:::tip
- **promise chain 中如何传递参数**

只需要在TaskA中 `return` 的返回值，会在 `TaskB`执行时传给它

```js
function doubleUp(value) {
  return value * 2;
}
function increment(value) {
  return value + 1;
}
function output(value) {
  console.log(value);// => (1 + 1) * 2
}

var promise = Promise.resolve(1);
promise
  .then(increment)
  .then(doubleUp)
  .then(output)
  .catch(function(error){
    // promise chain中出现异常的时候会被调用
    console.error(error);
});
```

- `.then`里同时指定处理对错误进行处理对函数相比，和使用 `.catch`又有什么异同？
1. 我们在 `.then` 的第二个参数中指定了用来错误处理的函数，但实际上它却不能捕获第一个参数 `onFulfilled` 指定的函数里面出现的错误。
2. `.then` 方法中的`onRejected`参数所指定的回调函数，实际上针对的是其`promise`对象或者之前的`promise`对象，而不是针对 .`then` 方法里面指定的第一个参数，即`onFulfilled`所指向的对象，这也是 `then` 和 `catch` 表现不同的原因。
:::

## Promise实例对象上的方法
### `Promise.all()`
该方法用于将多个`Promise`实例包装成一个新的`Promise`实例。
```js
var p = Promise.all([p1,p2,p3])
```
> 接收一个数组作为参数，`p1-p3`都是`Promise`实例。如果不是就会先调用`Promise.resolve()`方法，将参数转为`Promise`实例；参数不一定是数组，但是必须具有`Iterator`接口，且返回的每个成员都是`Promise`实例。

- `p1-p3`状态都为`Fulfilled`，`p`状态才为`Fulfilled`，此时三个实例的返回值组成一个数组，传递给`p`的回调函数
- 三个实例中有一个状态为`Rejected`，`p`的状态也为`Rejected`，此时第一个被`Rejected`实例的返回值传递给`p`

只有满足上面两种情况，才会调用`Promise.all`方法后面的回调函数

```js
var promises = [2,3,5,7,11,13].map((id) => getJSON('/post/' + id + '.json'))
Promise.all(promises).then((posts) => {}).catch((reason) => {})
```
> 所有 `Promise` 中，只要出现一个 `pending` 状态的实例，那么合成的新实例也是 `pending` 状态的。

```js
let p1 = Promise.all([
    3,
    Promise.resolve(6),
    new Promise(() => {})
])
setTimeout(console.log, 0, p1)
// Promise {<pending>}
```

```js
var p1 = Promise.resolve('1号选手')
var p2 = '2号选手'
var p3 = new Promise((resolve,reject) => {
  setTimeout(resolve,100,'3号选手')
})
Promise.all([p1,p2,p3]).then(values => {
  console.log(values)
})
// ['1号选手','2号选手','3号选手']
```
**如果作为参数的`Promise`实例本身定义了`catch`方法，那么它被`rejected`时并不会触发`Promise.all()`的`catch`方法**

::: tip
题目：
- 第一题
```js
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))

/**
 *
 *
1
3
// 2s后输出
2
Error: 2
// 4s后输出
4
```
> `.catch`是会捕获最先的那个异常，在这道题目中最先的异常就是`runReject(2)`的结果。另外，如果一组异步操作中有一个异常都不会进入`.then()`的第一个回调函数参数中。

> 每个`promise`的结果（`resolve`或`reject`时传递的参数值），和传递给 `Promise.all` 的`promise`数组的顺序是一致的。也就是说，这时候 `.then` 得到的`promise`数组的执行结果的顺序是固定的
:::

### `Promise.race()`
这个方法和`Promise.all()`传参类似，区别在于只要有一个实例率先改变状态，`p`的状态也跟着改变。那个率先改变的`Promise`实例的返回值就会传给`p`的回调函数

- **`Promise.race` 在第一个`promise`对象变为`Fulfilled`之后，并不会取消其他`promise`对象的执行。**

```js
let p1 = Promise.race([
    3,
    Promise.reject(6),
    new Promise((resolve, reject) => {
        resolve(9)
    }).then(res => {
        console.log(res) //9
    })
])
let p2 = p1.then(err => {
    console.log(err) //3
})
setTimeout(console.log, 0, p1)
// 9
// 3
// Promise {<fulfilled>: 3}

// 变动一下代码
function init(){
    console.log(3)
    return 3
}
let p1 = Promise.race([
    new Promise((resolve, reject) => {
        resolve(9)
    }).then(res => {
        console.log(res)
        return 'A'
    }),
    new Promise((resolve, reject) => {
        reject(6)
    }),
    init(),
])
let p2 = p1.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})
setTimeout(console.log, 0, p1)
// 3
// 9
// 6
// Promise {<rejected>: 6}

var p1 = new Promise(function(resolve,reject) {
  setTimeout(resolve,100,'1号选手')
})
var p2 = new Promise(function(resolve,reject) {
  setTimeout(resolve,50,{name: '2号选手'})
})
Promise.race([p1,p2]).then((res) => {
  console.log(res)
})
// {name: '2号选手'}
```

::: tip
想要知道 `Promise.race()` 的结果，无非是要知道到底谁才是第一个状态变化的实例:
- 迭代第一个元素，执行同步代码 `resolve(9)`，由 `new Promise` 初始化的实例的状态已经变为了 `fulfilled`，所以第一个状态变化的实例已经出现了吗？其实并没有，因为迭代第一个元素的代码还没执行完成呢，然后会将 `return 'A'` 所在函数的这段处理程序推入微任务队列 `1`；
- 迭代第二个元素，执行 `reject(6)`，所以由 `new Promise` 初始化的实例的状态已经变为 `rejected`，由于该实例没有处理函数，所以迭代第二个元素的代码已经全部执行完成，此时，**第一个状态变化的实例已经产生**；
- 迭代第三个元素，是一个函数，执行同步代码打印出 `3`，然后用 `Promise.resolve` 将函数返回值 `3` 转成一个 `Promise {<fulfilled>: 3}` 的新实例，这是**第二个状态发生变化的实例**；
- 此时所有迭代对象遍历完成，即同步代码执行完成，开始执行微任务队列 `1` 的内容，打印 `res`，其值是 `9`，然后处理程序返回了 `'A'`，此时根据之前提到的知识点，这里会新生成一个 `Promise {<fulfilled>: 'A'}` 的实例，这是**第三个状态发生变化的实例**。此时，第一个迭代元素的代码已经全部执行完成，所以第一个迭代元素最终生成的实例是第三次状态发生变化的这个；
- 此时 `p1` 已经产生，它是 `Promise {<rejected>: 6}`，所以会将它的处理程序 `console.log(err)` 所在函数推入微任务队列 `2`；
- 执行微任务队列 `2` 的内容，打印 `err`，其值是 `6`；
- 所有微任务执行完成，开始执行 `setTimeout` 里的宏任务，打印 `p1`，至此全部代码执行完成。
:::

**还能利用`Promise.race`设置超时函数**
```js
 //请求某个图片资源
function requestImg(){
    var p = new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function(){
            resolve(img);
        }
        img.src = '图片的路径';
    });
    return p;
}
//延时函数，用于给请求计时
function timeout(){
    var p = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('图片请求超时');
        }, 5000);
    });
    return p;
}
Promise.race([requestImg(), timeout()]).then((data) =>{
    console.log(data);
}).catch((err) => {
    console.log(err);
});
```

### `Promise.resolve()`
将对象转为`Promise`对象。
```js
Promise.resolve('foo')

// 等同于
new Promise(resolve => resolve('foo'))
```
该方法参数分成4种情况：
1. 参数是一个`Promise`实例。
> 如果参数是`Promise`实例，那么`Promise.resolve`将不做任何修改，原封不动地返回这个实例。

2. 参数是一个`thenable`对象，即具有`then`方法的对象，就会将这个对象转为`Promise`对象，然后立即执行`thenable`对象的`then`方法。
```js
let thenable = {
    then: function(resolve, reject) {
        resolve(42)
    }
}
let p1 = Promise.resolve(thenable)
p1.then((value) => {
    console.log(value) // 42
})
```
3. 参数不是`thenable`或者根本不是对象。该方法就会返回一个新的`Promise`对象，状态为`Resolved`
4. **不带任何参数，直接返回一个`Resolved`状态的`Promise`对象**

::: tip
需要注意的是，立即`resolve`的`Promise`对象是在本轮事件循环`event loop`结束时，而不是在下一轮事件循环开始时。
```js
setTimeout(function(){
  console.log('three')
},0)
Promise.resolve().then(function(){
  console.log('two')
})
console.log('one')
// one
// two
// three
```
:::

### `Promise.reject()`
```js
var p = Promise.reject('出错了')

// 等同于
var p = new Promise((resolve,reject) => reject('出错了'))

p.then(null, function(s) {
    console.log(s) // 出错了
})
```
**`Promise.reject()`方法的参数会原封不动作为`reject`的理由变成后续方法的参数**
```js
const thenable = {
    then(resolve, reject) {
        reject('出错了')
    }
}
Promise.reject(thenable)
.catch(e => {
    console.log(e === thenable)
})
// true
```
### `Promise.allSettled()`
> ES2020的新方法。当所有的实例都已经 `settled`，即状态变化过了，那么将返回一个新实例，该新实例的内部值是由所有实例的值和状态组合成的数组，数组的每项是由每个实例的状态和值组成的对象。返回新的`Promise`实例对象，状态为`fulfilled`

```js
function init(){
    return 3
}
let p1 = Promise.allSettled([
    new Promise((resolve, reject) => {
        resolve(9)
    }).then(res => {}),
    new Promise((resolve, reject) => {
        reject(6)
    }),
    init()
])
let p2 = p1.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})
// [
//      {status: "fulfilled", value: undefined},
//      {status: "rejected", reason: 6},
//      {status: "fulfilled", value: 3}
// ]
```
**对于该方法，兼容性可以写`polyfill`:**
```js
if(!Promise.allSettled) {
    Promise.allSettled = function(promises) {
        return Promise.all(promises.map(p => Promise.resolve(p)
            .then(value => ({
                status: 'fulfilled',
                value
            }), reason => ({
                status: 'rejected',
                reason
            }))
        ));
    }
}
```

## 两个不在ES6中但有用的方法
### `done()`
处于回调链尾端，保证抛出任何可能的错误。（可以不提供参数）
```js
Promise.prototype.done = function(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function (reason) {
            setTimeout(() => { throw reason}, 0)
        })
}

try{
    setTimeout(function callback() {
        throw new Error("error");
    }, 0);
}catch(error){
    console.error(error); // 不会捕获到错误
}
```
:::tip
从上面我们可以看出，`done`和`then`之间有以下不同点：
- `done` 并不返回 `promise` 对象。也就是说，在`done`之后不能使用 `catch` 等方法组成方法链
- `done` 中发生的异常会被直接抛给外面。也就是说，不会进行`Promise`的错误处理`（Error Handling）`

为什么异步的`callback`中抛出的异常不会被捕获的原因：
- 这跟浏览器的执行机制有关。异步任务由 `eventloop` 加入任务队列，并取出入栈(`js` 主进程)执行，而当 `task` 取出执行的时候， 上下文环境已经改变，所以无法捕获 `task` 的错误。
- 所以 `promise` 的任务，也就是 `then` 里面的回调函数，抛出错误同样也无法 `catch`。

```js
function main1() {
  try {
    new Promise(() => {
      throw new Error('promise1 error')
    })
  } catch(e) {
    console.log(e.message);
  }
}

function main2() {
  try {
    Promise.reject('promise2 error');
  } catch(e) {
    console.log(e.message);
  }
}

```
- 这样 `try catch` 不能捕获到 `error`，因为 `promise` 内部的错误不会冒泡出来，而是被 `promise` 吃掉了，只有通过 `promise.catch` 才可以捕获，所以用 `Promise` 一定要写 `catch` 啊!
:::

### `finally()`
用于指定不管`Promise`对象最后状态如何都会执行的操作。接收一个普通的回调函数作为参数，该参数不管如何都必须执行。
```js
Promise.prototype.finally = function(callback) {
    let P = this.constructor
    return this.then(
        value => P.resolve(callback()).then(() => value)
        reason => P.resolve(callback()).then(() => { throw reason })
    )
}
```
上面源码中，不管前面的`Promise`是`fulfilled/rejected`，都会执行`callback`回调函数，一般用来做后续代码的处理工作，所以 `finally` 一般会原样后传父 `Promise`，无论父级实例是什么状态。
```js
let p1 = new Promise(() => {})
let p2 = p1.finally(() => {})
setTimeout(console.log, 0, p2)  // Promise {<pending>}

let p3 = new Promise((resolve, reject) => {
    resolve(3)
})
let p4 = p3.finally(() => {})
setTimeout(console.log, 0, p3)  // Promise {<fulfilled>: 3}
```

**上面说的是一般，但是也有特殊情况，比如 `finally` 里返回了一个非 `fulfilled` 的 `Promise` 或者抛出了异常的时候，则会返回对应状态的新实例：**
```js
let p1 = new Promise((resolve, reject) => {
    resolve(3)
})
let p2 = p1.finally(() => new Promise(() => {}))
setTimeout(console.log, 0, p2)  // Promise {<pending>}

let p3 = p1.finally(() => Promise.reject(6))
setTimeout(console.log, 0, p3)  // Promise {<rejected>: 6}

let p4 = p1.finally(() => {
    throw new Error('error')
})
setTimeout(console.log, 0, p4)  // Promise {<rejected>: Error: error}
```

::: tip
`Promise.finally`的题目：
- 第一题
```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })

/*
*
'1'
'finally2'
'finally'
'finally2后面的then函数' '2'
*/
```

- 第二题
```js
Promise.resolve('1')
  .finally(() => {
    console.log('finally1')
    throw new Error('我是finally中抛出的异常')
  })
  .then(res => {
    console.log('finally后面的then函数', res)
  })
  .catch(err => {
    console.log('捕获错误', err)
  })

/**
 *
 * 'finally1'
'捕获错误' Error: 我是finally中抛出的异常
```
:::

## Promise的应用
1. 加载图片
```js
const preloadImage = function(path) {
    return new Promise(function(resolve, reject) {
        var image = new Image()
        image.onload = resolve;
        image.onerror = reject;
        image.src = path
    })
}
```
2. 使用`Promise` 进行顺序 `sequence`处理
`Promise.all` 方法会同时运行多个`promise`对象，如果想进行在`A`处理完成之后再开始B的处理，对于这种顺序执行的话 `Promise.all` 就无能为力了。

:::tip
### 循环和顺序处理
```js
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
var request = {
        comment: function getComment() {
            return getURL('http://azu.github.io/promises-book/json/comment.json').then(JSON.parse);
        },
        people: function getPeople() {
            return getURL('http://azu.github.io/promises-book/json/people.json').then(JSON.parse);
        }
    };
function main() {
    function recordValue(results, value) {
        results.push(value);
        return results;
    }
    // [] 用来保存初始化的值
    var pushValue = recordValue.bind(null, []);
    return request.comment().then(pushValue).then(request.people).then(pushValue);
}
// 运行示例
main().then(function (value) {
    console.log(value);
}).catch(function(error){
    console.error(error);
});
```

> 使用这种写法的话那么随着 `request` 中元素数量的增加，我们也需要不断增加对 `then` 方法的调用。因此，如果我们将处理内容统一放到数组里，再配合`for` 循环进行处理的话，那么处理内容的增加将不会再带来什么问题。

```js
function main() {
    function recordValue(results, value) {
        results.push(value);
        return results;
    }
    // [] 用来保存初始化值
    var pushValue = recordValue.bind(null, []);
    // 返回promise对象的函数的数组
    var tasks = [request.comment, request.people];
    var promise = Promise.resolve();
    // 开始的地方
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        promise = promise.then(task).then(pushValue);
    }
    return promise;
}
```

> 因此类似 `promise = promise.then(task).then(pushValue)`; 的代码就是通过不断对 `promise` 进行处理，不断的覆盖 `promise` 变量的值，以达到对 `promise` 对象的累积处理效果。但是这种方法需要 `promise` 这个临时变量，从代码质量上来说显得不那么简洁。如果将这种循环写法改用 `Array.prototype.reduce` 的话，那么代码就会变得聪明多了。

### `Promise.chain`和 `reduce`
```js
function main() {
    function recordValue(results, value) {
        results.push(value);
        return results;
    }
    var pushValue = recordValue.bind(null, []);
    var tasks = [request.comment, request.people];
    return tasks.reduce(function (promise, task) {
        return promise.then(task).then(pushValue);
    }, Promise.resolve());
}
```

> `Array.prototype.reduce` 的第二个参数用来设置盛放计算结果的初始值。在这个例子中， `Promise.resolve()` 会赋值给 `promise` ，此时的 `task` 为 `request.comment` 。在 `reduce` 中第一个参数中被 `return` 的值，则会被赋值为下次循环时的 `promise` 。也就是说，通过返回由 `then` 创建的新的 `promise` 对象，就实现了和`for`循环类似的 `Promise chain` 了。

> 使用`reduce`和`for`循环不同的地方是`reduce`不再需要临时变量 `promise` 了，因此也不用编写 `promise = promise.then(task).then(pushValue)`; 这样冗长的代码了，这是非常大的进步。虽然 `Array.prototype.reduce` 非常适合用来在`Promise`中进行顺序处理，但是上面的代码有可能让人难以理解它是如何工作的。
:::

## 使用Promise对象原因
1. 为了代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来。


## 一些题目🌰
1.
```js
new Promise((resolve, reject) => {
    resolve()
}).then(() => {
    console.log('A')
    new Promise((resolve, reject) => {
        resolve()
    }).then(() => {
        console.log('B')
    }).then(() => {
        console.log('C')
    })
}).then(() => {
    console.log('D')
})
// 输出 A B D C

//便于分析，代码写成这样：
new Promise(executor).then(onResolvedA).then(onResolvedD)

function executor(resolve, reject) {
    resolve()
}
function onResolvedA() {
    console.log('A')
    new Promise(executor).then(onResolvedB).then(onResolvedC)
}
function onResolvedB() {
    console.log('B')
}
function onResolvedC() {
    console.log('C')
}
function onResolvedD() {
    console.log('D')
}
```
::: tip
- 执行 `new Promise()`，立即同步执行 `executor` 函数，调用 `resolve()`，此时会将 `onResolvedA` 推入微任务队列 `1`，截止目前所有同步代码执行完成；
- 检查微任务队列，执行 `onResolvedA` 函数，打印 `A`，执行 `new Promise(executor)`，调用 `resolve()` 函数，此时将 `onResolvedB` 推入微任务队列 `2`；
- 截止目前微任务队列 `1` 的代码全部执行完成，即 `onResolvedA` 函数执行完成。我们知道 `onResolved` 函数会基于返回值生成一个新的 `Promise`，而 `onResolvedA` 函数没有显示的返回值，所以其返回值为 `undefined`，那么经过 `Promise.resolve(undefined)` 初始化后会生成一个这样的新实例：`Promise {<fulfilled>: undefined}`；由于这个新的实例状态已经变成 `fulfilled`，所以会立即将其处理函数 `onResolvedD` 推入微任务队列 `3`；
- 开始执行微任务队列 `2` 里的内容，打印 `B`，同上一条原理，由于 `onResolvedB` 函数的返回值为 `undefined`，所以生成了一个 `resolved` 的新实例，则会立即将 `onResolvedC` 推入微任务队列 `4`；
- 执行微任务队列 `3`，打印 `D`；
- 执行微任务队列 `4`，打印 `C`；
- 至此全部代码执行完成，最终的打印结果为：`A B D C`。
:::

2.
```js
new Promise((resolve, reject) => {
    resolve(1)
}).then(res => {
    console.log('A')
}).finally(() => {
    console.log('B')
})
new Promise((resolve, reject) => {
    resolve(2)
}).then(res => {
    console.log('C')
}).finally(() => {
    console.log('D')
})
// 打印结果：A C B D
```
::: tip
- 执行 `resolve(1)`，将处理程序 `A` 推入微任务队列 `1`；
- 执行 `resolve(2)`，将处理程序 `C` 推入微任务队列 `2`；
- 同步任务执行完成，执行微任务队列 `1` 里的内容，打印 `A`，`A` 所在函数执行完成后生成了一个 `fulfilled` 的新实例（值为`undefined`），由于新实例状态变化，所以会立即执行 `finally()` 处理程序 `B` 推入微任务队列 `3`；
- 执行微任务队列 `2` 的内容，打印 `C`，`C` 所在函数执行完成后，同上条原理会将处理程序 `D` 推入微任务队列 `4`；
- 执行微任务队列 `3` 的内容，打印 `B`；
- 执行微任务队列 `4` 的内容，打印 `D`；
代码全部执行完成，最终打印：`A C B D`。
:::

**如果给 `Promise` 实例添加了多个处理函数，当实例状态变化的时候，那么执行的过程就是按照添加时的顺序而执行的**
```js
new Promise((resolve, reject) => {
    resolve(1)
}).then(onResolvedA).finally(onFinally)

function onResolvedA() {
    console.log('A')
}
function onFinally() {
    console.log('B')
}
// A B
```
> `finally()` 处理程序执行的时候已经不是通过 `new Promise()` 初始化的实例，而是执行完 `onResolvedA` 函数的时候生成的新实例（状态为`fulfilled`，值为`undefined`，因为`then`执行时没有返回值）。

```js
new Promise((resolve, reject) => {
    resolve(1)
}).then(onResolvedA).finally(onFinally)

function onResolvedA() {
    console.log('A')
    return new Promise(() => {})
}
function onFinally() {
    console.log('B')
}
// A
```
> **由于 `onResolvedA` 返回了一个这样的 `Promise {<pending>}` 新实例，这个新实例的状态没有发生变化，所以不会执行 `finally` 处理程序 `onFinally`，所以不会打印 `B`。这个就说明了，链式调用的时候处理程序的执行是一步一步来的，只要前面的执行完了，生成了新的实例，然后根据新实例的状态变化，才去执行后续的处理程序。**

## `async...await`
> 其实 ES7 中的 `async` 及 `await` 就是 `Generator` 以及 `Promise` 的语法糖，内部的实现原理还是原来的，只不过是在写法上有所改变，这些实现一些异步任务写起来更像是执行同步任务。

一个函数如果加上`async`，那么该函数就会返回一个`Promise`。`await`表示紧跟在后面的表达式需要等待结果。进一步说，`async`函数完全可以看作由多个异步操作包装成的一个`Promise`对象，而`await`命令就是内部`then`命令的语法糖。

:::tip
在讨论 `await` 之前，先聊一下 `async` 函数处理返回值的问题，它会像 `Promise.prototype.then` 一样，会对返回值的类型进行辨识。

`async` 函数在抛出返回值时，会根据返回值类型开启不同数目的微任务：
- `return` 结果值：非 `thenable`、非 `promise`（不等待）
- `return` 结果值：`thenable`（等待 1个 `then` 的时间）
- `return` 结果值：`promise`（等待 2个 `then` 的时间）

```js
async function testA () {
    return 1;
}

testA().then(() => console.log(1));
Promise.resolve()
    .then(() => console.log(2))
    .then(() => console.log(3));

// (不等待)最终结果👉: 1 2 3

async function testB () {
    return {
        then (cb) {
            cb();
        }
    };
}

testB().then(() => console.log(1));
Promise.resolve()
    .then(() => console.log(2))
    .then(() => console.log(3));

// (等待一个then)最终结果👉: 2 1 3

async function testC () {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

testC().then(() => console.log(1));
Promise.resolve()
    .then(() => console.log(2))
    .then(() => console.log(3));

// (等待两个then)最终结果👉: 2 3 1


// 🌰
async function async1 () {
    console.log('1')
    await async2()
    console.log('AAA')
}

async function async2 () {
    console.log('3')
    return new Promise((resolve, reject) => {
        resolve()
        console.log('4')
    })
}

console.log('5')

setTimeout(() => {
    console.log('6')
}, 0);

async1()

new Promise((resolve) => {
    console.log('7')
    resolve()
}).then(() => {
    console.log('8')
}).then(() => {
    console.log('9')
}).then(() => {
    console.log('10')
})
console.log('11')

// 最终结果👉: 5 1 3 4 7 11 8 9 AAA 10 6
```
最后一个🌰分析：
- 先执行同步代码，输出 `5`
- 执行 `setTimeout`，是放入宏任务异步队列中
- 接着执行 `async1` 函数，输出 `1`
- 执行 `async2` 函数，输出 `3`
- `Promise` 构造器中代码属于同步代码，输出 `4`
- `async2` 函数的返回值是 `Promise` ，等待 `2` 个 `then` 后放行，所以 `AAA` 暂时无法输出
- `async1` 函数暂时结束，继续往下走，输出 `7`
- 同步代码，输出 `11`
- 执行第一个 `then`，输出 `8`
- 执行第二个 `then`，输出 `9`
- 终于等到了两个 `then` 执行完毕，执行 `async1` 函数里面剩下的，输出 `AAA`
- 再执行最后一个微任务 `then`，输出 `10`
- 执行最后的宏任务 `setTimeout`，输出 `6`
:::

### `await` 右值类型区别
- 非`thenable`：**`await` 后面接非 `thenable` 类型，会立即向微任务队列添加一个微任务 `then`，但不需等待**

```js
// 🌰1
async function test () {
    console.log(1);
    await 1;
    console.log(2);
}

test();
console.log(3);
// 最终结果👉: 1 3 2

// 🌰2
function func () {
    console.log(2);
}

async function test () {
    console.log(1);
    await func();
    console.log(3);
}

test();
console.log(4);

// 最终结果👉: 1 2 4 3

// 🌰3
async function test () {
    console.log(1);
    await 123
    console.log(2);
}

test();
console.log(3);

Promise.resolve()
    .then(() => console.log(4))
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));

// 最终结果👉: 1 3 2 4 5 6 7
```

- `thenable`类型：**`await` 后面接 `thenable` 类型，需要等待一个 `then` 的时间之后执行**
```js
async function test () {
    console.log(1);
    await {
        then (cb) {
            cb();
        },
    };
    console.log(2);
}

test();
console.log(3);

Promise.resolve()
    .then(() => console.log(4))
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));

// 最终结果👉: 1 3 4 2 5 6 7
```

- `Promise类型`: **表现的跟非`thenable`一样，TC 39(ECMAScript标准制定者) 对 `await` 后面是 `promise` 的情况如何处理进行了一次修改，移除了额外的两个微任务，在早期版本，依然会等待两个 `then` 的时间**

```js
async function test () {
    console.log(1);
    await new Promise((resolve, reject) => {
        resolve()
    })
    console.log(2);
}

test();
console.log(3);

Promise.resolve()
    .then(() => console.log(4))
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));

// 最终结果👉: 1 3 2 4 5 6 7
```

### 用法
1. `async`函数返回一个`Promise`对象，可以使用`then`方法添加回调函数。`async` 直接将返回值使用`Promise.resolve()` 进行包裹（与 `then` 处理效果相同）。当函数执行时，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

2. `await` 只能配套 `async` 使用， `await` 内部实现了 `generator` ， `await` 就是 `generator` 加上`Promise` 的语法糖，且内部实现了自动执行 `generator` 。

> `async` 和 `await` 可以说是异步终极解决方案了，相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码，毕竟写一大堆 `then` 也很恶心，并且也能优雅地解决回调地狱问题。当然也存在一些缺点，因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。

### 语法
1. `async`函数内部抛出的错误会导致返回的`Promise`对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

```js
async function f() {
    throw new Error('出错了')
}
f().then(
    v => console.log(v),
    e => console.log(e)
)
// Error: 出错了
```

2. **`async`函数返回的`Promise`对象必须等到内部所有`await`命令后面的`Promise`对象执行完才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。**

3. 正常情况下，`await`命令后面是一个`Promise`对象，如果不是，会被转成一个立即`resolve`的`Promise`对象。
```js
async function f() {
    return await 123;
}

f().then(v => console.log(v)) // 123
```
4. `await`命令后面的`Promise`对象如果变成`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。**跟在`await`前面加上`return`效果一样**。只要一个`await`语句后面的`Promise`变为`reject`，那么整个`async`函数都会中断执行。

5. 由上述语法得知，如果我们需要前一个异步操作失败，也不要中断后面的异步操作。这时可以：
- 将第一个`await`放在`try...catch`结构里面，这样第二个`await`都会执行。
```js
async function f() {
    try {
        await Promise.reject('出错了')
    } catch(e) {

    }
    return await Promise.resolve('hello world')
}
```
- 另一种方法是在`await`后面的`Promise`对象添加一个`catch`方法，处理前面可能出现的错误
```js
async function f() {
    await Promise.reject('出错了')
        .catch(e => console.log(e))
    return await Promise.resolve('Hello world')
}
```

6. `async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。
```js
async function f() {
    return 'hello world'
}

f().then(v => console.log(v))
// hello world
```

::: tip
`await`关键字后，整个函数会像被`yield`了一样，暂停下来，直到异步任务的结果返回后，才会被唤醒，继续执行后面的语句。
:::