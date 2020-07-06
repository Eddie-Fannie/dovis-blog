# 节流防抖
## 定时器
> 调用环境总是`window`
## 节流
> 函数节流的基本思想是指：某些代码不可以在没有间断的情况下连续重复执行。**第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用函数时，会清除前一次的定时器并设置另一个**

### 实现方案
- 第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差（Xms） ，如果是则执行，并更新上次执行的时间戳，如此循环。

```js
function throttle(fun, delay) {
    let last, deferTimer
    return function (args) {
        let that = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function () {
                last = now
                console.log(last)
                fun.apply(that, _args)
            }, delay)
        }else {
            last = now
            console.log(last)
            fun.apply(that,_args)
        }
    }
}
```
- 第二种方法是使用定时器，比如当 scroll 事件刚触发时，打印一个 hello world，然后设置个 1000ms 的定时器，此后每次触发 scroll 事件触发回调，如果已经存在定时器，则回调不执行方法，直到定时器触发，handler 被清除，然后重新设置定时器。

> 只要代码是周期性执行的，都使用节流。**规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。**

## 防抖
> 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

```js
function debounce(fun, delay) {
    return function (args) {
        let that = this
        let _args = args
        clearTimeout(fun.id)
        fun.id = setTimeout(function () {
            fun.call(that, _args)
        }, delay)
    }
}
```

## 节流防抖总结
- 函数防抖是某一段时间内执行一次；函数节流是间隔时间执行。

## 两者应用场景
+ 防抖`debounce`
    - 搜索联想
    - `window`触发`resize`
+ 节流`throttle`
    - 鼠标不断点击触发
    - 监听滚动事件