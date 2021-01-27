# Web的一些常用API
## `window.requestAnimationFrame()`
> 执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

::: warning
若想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`。

该`API`返回一个`long`整数，请求`ID`，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给`window.cancelAnimationFrame()`以取消回调函数。
:::

```js
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```
> 首先 `requestAnimationFrame` 自带函数节流功能，基本可以保证在 `16.7` 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题，当然你也可以通过该函数来实现 `setTimeout`。

::: tip
利用`setTimeout`实现动画效果，容易出现卡顿，抖动的现象。原因是：`setTimeout`任务被放入异步队列，只有当主线程任务执行后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；`setTimeout`的固定时间间隔不一定与屏幕刷新时间相同，会引起丢帧。

`requestAnimationFrame`：优势：由系统决定回调函数的执行时机。`60Hz`的刷新频率，那么每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿。在高频率事件(`resize/scroll`等)中，为了防止在一个刷新间隔内发生多次函数执行，可以保证每个刷新时间间隔内，函数只被执行一次，这样既能保证流畅性，也能更好节省函数执行的开销。

> 使用`setTimeout`实现的动画，当页面被隐藏或最小化时，`setTimeout`仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费`CPU`资源。而`requestAnimationFrame`则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的`requestAnimationFrame`也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了`CPU`开销。
:::

实现`window.requestAnimationFrame`的`polyfill`
```js
if(!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback,element) => {
    const id = window.setTimeout(() => {
      callback()
    },1000/60)
    return id
  }
}
if(!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = id => {
    clearTimeout(id)
  }
}
```