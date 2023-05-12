# vue的异步更新原理
我们把主线程执行一次的过程叫一个`tick`，所以`nextTick`就是下一个`tick`的意思，也就是说用`nextTick`的场景就是我们想在下一个`tick`做一些事的时候。

> `nextTick`接收一个回调函数作为参数，它的作用是将回调延迟到下次`DOM`更新周期之后执行。在vue.js中当状态发生变化时`watcher`会得到通知，然后触发虚拟`DOM`的渲染流程。而`watcher`触发渲染这个操作并不是同步的，而是异步的。vue中有个队列，每当需要渲染时会将`watcher`推送到这个队列中，在下一次事件循环中再让`watcher`触发渲染的流程。

## 为什么使用异步更新队列
vue2.0使用虚拟`DOM`进行渲染，变化侦测的通知只发送到组件，组件用到的所有状态的变化都会通知到同一个`watcher`，然后虚拟`DOM`会对整个组件进行对比`diff`并更改`DOM`。也就是说如果在同一轮事件循环中有两个数据发生变化，那么组件的`watcher`会收到两份通知，从而进行两次渲染。事实上，只需要等所有状态都修改完毕。一次性将整个组件的`DOM`渲染到最新即可。

> 要解决这个问题vue的实现方式就是将接收到通知的`watcher`实例添加到队列中缓存起来，并且在添加到队列之前检查其中是否已经存在相同的`watcher`，只有不存在时才加入队列。然后在下一次事件循环中，vue会让队列中的`watcher`触发渲染流程并清空队列。

**下次`DOM`更新周期的意思其实是下次微任务执行时更新`DOM`。而`vm.$nextTick`其实是将回调添加到微任务中。只有在特殊情况下才会降级为宏任务。**

```js
const callbacks = []
let pending = false
function flushCallbacks () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for(let i=0;i<copies.length;i++) {
        copies[i]()
    }
}

let microTimerFunc
const p = Promise.resolve()
microTimerFunc = () => {
    p.then(flushCallbacks)
}
export function nextTick(cb,ctx) {
    callbacks.push(() => {
        if(cb) {
            cb.call(ctx)
        }
    })
    if(!pending) {
        pending = true
        microTimerFunc()
    }
}
```

::: tip
- 我们通过数组`callbacks`来存储用户注册的回调，声明了变量`pending`来标记是否已经向任务队列中添加任务。每当向任务队列中插入任务时，将`pengding`设置为`true`，每当任务被执行时将`pending`设置为`false`，这样就可以通过`pending`的值来判断是否需要向任务队列中添加任务。

- `flushCallbacks`，就是我们所说的被注册的那个任务。当这个函数被触发时，会将`callbacks`中的所有函数依次执行。然后清空`callbacks`，并将`pending`设置为`false`。也就是说，一轮事件循环中`flushCallbacks`只会执行一次。

- 优先检测是否原生⽀持`Promise`，不⽀持的话再去检测是否⽀持`MutationObserver`，如果都不行就只能尝试宏任务实现，vue宏任务优先使用`setImmediate`（只兼容IE）。如果都不支持就使用`setTimeout`来将回调添加到宏任务队列中。

```js
// 使用 mutationObserver
let counter = 1
const observer = new MutationObserver(flushCallbacks)
const textNode = document.createTextNode(String(counter))
observer.observe(textNode, {
    characterData: true
})
timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
}
isUsingMicroTask = true
```
> 这段代码的作用是创建一个 `MutationObserver` 对象，通过观察一个文本节点的变化来触发回调函数 `flushCallbacks` 。具体来说，它会创建一个文本节点，并将其添加到 `DOM` 中。然后，`MutationObserver` 对象会监听这个文本节点的变化，一旦发生变化就会触发 `flushCallbacks` 回调函数。在 `timerFunc` `函数中，它会修改counter` 变量的值，并将新的值设置为文本节点的 `data` 属性，从而触发 `MutationObserver` 对象的回调函数。这样就实现了一个异步更新的效果。
:::