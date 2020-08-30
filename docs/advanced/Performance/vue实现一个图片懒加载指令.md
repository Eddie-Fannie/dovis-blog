# vue实现一个图片懒加载指令
参考[ConardLi大佬](https://github.com/ConardLi/awesome-coding-js/blob/master/JavaScript/%E5%9B%BE%E7%89%87%E6%87%92%E5%8A%A0%E8%BD%BD.md)

> 图片的标签是`img`标签，图片的来源主要是`src`属性，浏览器是否发起加载图片的请求是根据是否有`src`属性决定的。所以可以从`img`标签的`src`属性入手，在没进到可视区域的时候，就先不给`img`标签的`src`属性赋值。
```html
<img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg" alt="">
<img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_1280.jpg" alt="">
<img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/12/15/17/16/pier-569314_1280.jpg" alt="">
<img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2010/12/13/10/09/abstract-2384_1280.jpg" alt="">
<img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/10/24/11/09/drop-of-water-1004250_1280.jpg"
```

## 监听 `scroll` 事件判断元素是否进入视口
通过图片的`offsetTop`和`window`的`innerHeight`，`scrollTop`判断图片是否位于可视区域
```js
var img = document.getElementsByTagName("img");
var n = 0; //存储图片加载到的位置，避免每次都从第一张图片开始遍历
lazyload(); //页面载入完毕加载可是区域内的图片
// 节流函数，保证每200ms触发一次
function throttle(event, time) {
    let timer = null;
    return function (...args) {
    if (!timer) {
        timer = setTimeout(() => {
        timer = null;
        event.apply(this, args);
        }, time);
    }
    }
}
window.addEventListener('scroll', throttle(lazyload, 200))
function lazyload() { //监听页面滚动事件
    var seeHeight = window.innerHeight; //可见区域高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
    for (var i = n; i < img.length; i++) {
        console.log(img[i].offsetTop, seeHeight, scrollTop);
        if (img[i].offsetTop < seeHeight + scrollTop) {
            if (img[i].getAttribute("src") == "loading.gif") {
            img[i].src = img[i].getAttribute("data-src");
            }
            n = i + 1;
        }
    }
}
```

+ 可能会存在下面几个问题：
    - 每次滑动都要执行一次循环，如果有`1000`多个图片，性能会很差
    - 每次读取 `scrollTop` 都会引起回流
    - `scrollTop`跟`DOM`的嵌套关系有关，应该根据`getboundingclientrect`获取
    > `Element.getBoundingClientRect()` 方法返回元素的大小及其相对于视口的位置。返回的结果是包含完整元素的最小矩形，并且拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`这几个以像素为单位的只读属性用于描述整个边框。除了`width` 和 `height` 以外的属性是相对于视图窗口的左上角来计算的。**当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，`top`和`left`属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给`top`、`left`属性值加上当前的滚动位置（通过 `window.scrollX` 和 `window.scrollY`），这样就可以获取与当前的滚动位置无关的值。**
    - 滑到最后的时候刷新，会看到所有的图片都加载了

## `IntersectionObserver`
> `IntersectionObserver`接口 (从属于`Intersection Observer API`) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(`viewport`)交叉状态的方法。祖先元素与视窗(`viewport`)被称为根(`root`)。当一个`IntersectionObserver`对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦`IntersectionObserver`被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

创建一个 `IntersectionObserver`对象，并传入相应参数和回调用函数，该回调函数将会在目标(`target`)元素和根(`root`)元素的交集大小超过阈值(`threshold`)规定的大小时候被执行。
```js
var observer = new IntersectionObserver(callback, options); // callback是可见性变化时的回调函数；options参数可选
```
**返回的`observer`是一个观察器实例**
实例的方法：
- `IntersectionObserver.observe()`
> 开始监听一个目标元素
- `IntersectionObserver.unobserve()`
> 停止监听特定的目标元素
- `IntersectionObserver.disconnect()`
> 关闭监听器

所以图片懒加载代码如下：
```js
var img = document.getElementsByTagName("img");
// 当监听的元素进入可视范围内的会触发回调
if (IntersectionObserver) {
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {  // entry其实就是每一个IntersectionObserverEntry对象，提供目标元素的信息，一共有六个属性。
            let lazyImage = entry.target;
            // 如果元素可见            
            if (entry.intersectionRatio > 0) {
                if (lazyImage.getAttribute("src") == "loading.gif") {
                    lazyImage.src = lazyImage.getAttribute("data-src");
                }
                lazyImageObserver.unobserve(lazyImage)
            }
        })
    })
    for (let i = 0; i < img.length; i++) {
        lazyImageObserver.observe(img[i]);
    }
}
```
::: tip
`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。`callback`函数的参数（`entries`）是一个数组，每个成员都是一个`IntersectionObserverEntry`对象。因为后面遍历循环了图片数值，所以有多个被观察的对象。
:::

### 实现无限滚动
```js
var intersectionObserver = new IntersectionObserver(
  function (entries) {
    // 如果不可见，就返回
    if (entries[0].intersectionRatio <= 0) return;
    loadItems(10);
    console.log('Loaded new items');
  });

// 开始观察
intersectionObserver.observe(
  document.querySelector('.scrollerFooter')
);
```
> 无限滚动时，最好在页面底部有一个页尾栏。一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的条目放在页尾栏前面。这样做的好处是，不需要再一次调用`observe()`方法，现有的`IntersectionObserver`可以保持使用。

## 实现vue自定义指令v-lazyload
```js
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            img {
                width: 100%;
                height: 300px;
            }
        </style>
    </head>
    <body>
        <div id="app">
            <p v-for="item in imgs" :key="item">
                <img v-lazyload="item">
            </p>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script>
        Vue.directive("lazyload", {
            // 指令的定义
            bind: function(el, binding) {
                let lazyImageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry, index) => {
                        let lazyImage = entry.target;
                        // 相交率，默认是相对于浏览器视窗
                        if(entry.intersectionRatio > 0) {
                            lazyImage.src = binding.value;
                            // 当前图片加载完之后需要去掉监听
                            lazyImageObserver.unobserve(lazyImage);
                        }

                    })
                })
                lazyImageObserver.observe(el);
            },
        });
        var app = new Vue({
            el: "#app",
            data: {
                imgs: [
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657907683.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657913523.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657925550.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657930289.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657934750.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657918315.jpeg',
                ]
            },
        });
    </script>
</html>
```
代码参考[牧码的星星](https://mp.weixin.qq.com/s/36oBZMd-m-2k5EKPghfG3A)。自定义指令具体内容可以看`vue`官方文档