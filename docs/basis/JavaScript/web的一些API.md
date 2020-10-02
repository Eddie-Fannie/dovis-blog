# Web的一些常用API
## `window.requestAnimationFrame()`
> 执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

::: warning
若想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`。

该`API`返回一个`long`整数，请求ID，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给`window.cancelAnimationFrame()`以取消回调函数。
:::