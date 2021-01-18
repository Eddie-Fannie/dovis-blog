# 节流防抖
## 定时器
> 调用环境总是`window`

## 防抖
> 在事件被触发`n`秒后再执行回调，如果在这`n`秒内又被触发，则重新计时。在某段时间内，不管你触发多少次回调，我都只认最后一次。

```js
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}
```

**例子1：**
```js
var count = 1;
var container = document.getElementsByClassName('container')[0]
// container.addEventListener('mousemove', debounce(() => {
//     container.innerHTML = count++
// }, 3000))
container.addEventListener('mousemove', (e) => {
    console.log(e)
    container.innerHTML = count++
})
```
::: tip
没有防抖之前鼠标移入`dom`会使数字一直递增；防抖之后，鼠标移入隔了`3`秒数字递增至`2`，然后频繁滑动鼠标不会使数字继续递增，只有停止鼠标触发事件之后的第三秒数字才继续递增。**鼠标移出`dom`容器外数字会递增最后一次。**
:::

### 防抖代码升级
> 因为触发事件加入防抖函数后，`this`会指向`Window`对象。所以就会利用`apply`改变`this`指向；没有使用防抖函数下，触发鼠标事件会打印出`event`对象，加入防抖函数后，打印为`undefined`，所以就要传入参数类数组`args`。**升级后的防抖代码：**

```js
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

> 继续升级，可以立即执行版本
```js
function myDebounce(func,wait=100,immediate=true) {
    let timer = null
    return function() {
        let args =Array.from(arguments)
        let context = this
        if(timer) {
            clearTimeout(timer)
        }
        if(!immediate) {
            // 不是立即执行
            timer = setTimeout(() => {
                // 保证this指向不变
                func.apply(context,[...args])
            },wait)
        } else {
            // 立即执行 n秒内不再触发
            let callnew = !timer
            timer = setTimeout(() => {
                timer = null
                console.log('哈哈哈哈哈哈')
            },wait)
            if(callnew) {
                func.apply(context,[...args])
            }
        }
    }
}
```

## 节流
> 函数节流的基本思想是指：**如果你持续触发事件，每隔一段时间只执行一次事件**。即通过一段时间内无视后来产生的回调请求来实现。

### 实现方案
- 第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差`（Xms）` ，如果是则执行，并更新上次执行的时间戳，如此循环。
```js
function throttle(func, wait) {
    var context, args;
    var previous = 0;
// 如果这里保留调用上下文：context = this，则指向全局的window
    return function() {
        var now = +new Date();
        context = this; // 保留调用时的上下文
        args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```
**例子1:**
```js
var container = document.getElementById('main')
container.addEventListener('mousemove',throttle(() => {
    console.log('hhhhh')
},1000))
```
> 结果就是频繁触发`mousemove`，也只是每隔一秒输出一句`console.log('hhhhh')`

- 第二种方法是使用定时器，比如当`scroll`事件刚触发时，打印一个`hello world`，然后设置个`1000ms`的定时器，此后每次触发`scroll`事件触发回调，如果已经存在定时器，则回调不执行方法，直到定时器触发，`handler`被清除，然后重新设置定时器。
```js
function throttle(func, wait) {
    var timeout;
    var context,args
    return function() {
        context = this;
        args = arguments;
        if (!timeout) {
            timeout = setTimeout(function(){
                timeout = null;
                func.apply(context, args)
            }, wait)
        }

    }
}
```

**例子2:**
```js
var container = document.getElementById('main')
container.addEventListener('mousemove',throttle(() => {
    console.log('hhhhh')
},3000))
```
> 当鼠标移入的时候，事件不会立刻执行，晃了`3s`后终于执行了一次，此后每`3s`执行一次，当数字显示为`3`的时候，立刻移出鼠标，相当于大约`9.2s`的时候停止触发，但是依然会在第`12s`的时候执行一次事件。

::: tip
前面两种方法比较：
1. 第一种事件会立即执行，第二种事件会在`n`秒后第一次执行。
2. 第一种事件停止触发后没有办法再次执行事件，第二种停止触发后依然再执行一次。
:::

**第一二种方案结合--双剑合璧**
> 触发就立即执行，停止触发还能再执行一次。

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
                fun.apply(that, _args)
            }, delay)
        }else {
            last = now
            fun.apply(that,_args)
        }
    }
}
```

> 只要代码是周期性执行的，都使用节流。**规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。**

## 节流防抖总结
- 函数防抖是某一段时间内执行一次；函数节流是间隔时间执行。

## 两者应用场景
+ 防抖`debounce`
    - 搜索联想
    - `window`触发`resize`
+ 节流`throttle`
    - 鼠标不断点击触发
    - 监听滚动事件

## 学习函数工具库`lodash`的防抖节流源码