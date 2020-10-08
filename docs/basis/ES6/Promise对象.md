# Promise对象
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
- 无法取消，一旦新建就会立即执行，无法中途取消。
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
::: tip
`Promise`实例生成以后，可以`then`方法分别指定`Resolved/Rejected`状态的回调函数。第二个参数为可选
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
2. `then`方法指定的回调函数将在当前脚本所有同步任务执行完成后才执行。

## 用Promise实现Ajax例子
```js
var getJson = function(url) {
    var promise = new Promise((resolve, reject) => {
        var client = new XMLHttpRequest;
        client.open('GET', url)
        client.onreadystatechange = handler;
        client.responseType = 'json'
        client.setRequestHeader('Accept', 'application/json')
        client.send()
    })
    function handler() {
        if(this.readState !== 4) {
            return;
        }
        if(this.status === 200) {
            console.log(this.response)
            resolve(this.response)
        } else {
            reject(new Error(this.statusText))
        }
    }
    return promise
}

getJson('http://ueclub.kingdee.com/kux/index/top').then((json) => {
    console.log(json)
}, (error) => {
    console.log(error)
})
```

**调用`resolve`或者`reject`并不会终结`Promise`的参数函数的执行**
```js
new Promise((resolve, reject) => {
    resolve()
    console.log(2)
}).then(r => {
    console.log(1)
})
// 2
// 1
```
> 一般来说，调用`resolve`或者`reject`以后，`Promise`的使命就完成了，后继操作应该放到`then`方法里面，而不应该直接写在`resolve`或`reject`后面。所以，最好在它们前面加上`return`语句，这样不会产生意外，不过这样后面的语句就自然不会执行。

## Promise原型链上的方法
`Promise.prototype.then()/Promise.prototype.catch()`
### `then`
`then`方法第一个参数是`Resolved`状态的回调函数，第二个参数（可选）是`Rejected`状态的回调函数
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

**如果作为参数的`Promise`实例本身定义了`catch`方法，那么它被`rejected`时并不会触发`Promise.all()`的`catch`方法**

### `Promise.race()`
这个方法和`Promise.all()`传参类似，区别在于只要有一个实例率先改变状态，`p`的状态也跟着改变。那个率先改变的`Promise`实例的返回值就会传给`p`的回调函数

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
4. 不带任何参数，直接返回一个`Resolved`状态的`Promise`对象

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

### `done()`
处于回调链尾端，保证抛出任何可能的错误。（可以不提供参数）
```js
Promise.prototype.done = function(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function (reason) {
            setTimeout(() => { throw reason}, 0)
        })
}
```

### `finally()`
用于指定不管`Promise`对象最后状态如何都会执行的操作。接收一个普通的回调函数作为参数，该参数不管如何都必须执行。
```js
Promise.prototype.finally = function(callback) {
    let p = this.constructor
    return this.then(
        value => P.resolve(callback()).then(() => value)
        reason => P.resolve(callback()).then(() => { throw reason })
    )
}
```
上面源码中，不管前面的`Promise`是`fulfilled/rejected`，都会执行`callback`回调函数

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
## 使用Promise对象原因
1. 为了代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来。

## `async...await`
> 其实 ES7 中的 `async` 及 `await` 就是 `Generator` 以及 `Promise` 的语法糖，内部的实现原理还是原来的，只不过是在写法上有所改变，这些实现一些异步任务写起来更像是执行同步任务。

一个函数如果加上`async`，那么该函数就会返回一个`Promise`。`await`表示紧跟在后面的表达式需要等待结果。进一步说，`async`函数完全可以看作由多个异步操作包装成的一个`Promise`对象，而`await`命令就是内部`then`命令的语法糖。

### 用法
1. `async`函数返回一个`Promise`对象，可以使用`then`方法添加回调函数。`async` 直接将返回值使用`Promise.resolve()` 进行包裹（与 `then` 处理效果相同）。当函数执行时，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。
```js
async function f() {
    return 'hello world'
}

f().then(v => console.log(v))
// hello world
```
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

2. `async`函数返回的`Promise`对象必须等到内部所有`await`命令后面的`Promise`对象执行完才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。
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