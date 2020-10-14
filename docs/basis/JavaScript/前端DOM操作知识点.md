# 前端DOM知识点
## 节点层次
1. 文档节点是每个文档的根节点。在`HTML`文档元素始终都是`<html>`元素。
2. 每个节点都有一个`childNodes`属性，其中保存着一个`NodeList`对象。`NodeList`是一种类数组对象，用于保存一组有序的节点，可以通过方括号，也可以使用`item()`方法访问该类数组中的对象。通过使用列表中每个节点的`previousSibling`和`nextSibling`属性，可以访问类数组列表某个节点的相邻节点。
3. 每个节点都有一个`parentNode`属性，该属性指向文档树中的父节点。父节点有个`firstChild/lastChild`值表示第一个和最后一个子节点。`hasChildNodes()`表示有子节点时返回`true`
4. 所有节点都有最后一个属性`ownerDocument`，该属性指向表示整个文档的文档节点。这种关系表示的是任何节点都属于它所在的文档，任何节点都不能同时存在于两个或更多个文档中。

## 操作节点
1. `appendChild()`用于向`childNodes`列表末尾添加一个节点。返回新增的节点。**如果传入到`appendChild()`中的节点已经是文档的一部分，那结果就是该节点从原来的位置转移到新位置。即使可以将DOM树看成一系列指针连接起来的，但任何`DOM`节点也不能同时出现在文档多个位置中。因此如果在调用`appendChild()`时传入了父节点的第一个子节点，那么该节点就会成为父节点的最后一个子节点**
2. 如果需要把节点放在`childNodes`列表中某个特定位置上，而不是放末尾，那么可以使用`insertBefore()`方法。这个方法接受两个参数：要插入的节点和作为参照的节点。插入节点后被插入的节点会成为参照节点的前一个节点，同时被方法返回。如果参照节点为`null`，则该方法和`appendChild()`执行相同操作
3. `replaceChild()`接受两个参数：要插入的节点和要替换的节点。要替换的节点将被移除，被要插入的节点所替代。如果只想移除而非替换可以使用`removeChild()`方法。被移除的节点将作为参数传入，也将成为该方法的返回值。**两个方法中移除的节点都仍然为文档所有，不过在文档中没有位置了**
4. `cloneNode()`用于创建调用这个方法的节点的一个完全相同的副本，接受一个布尔值参数表示是否执行深复制。深复制指的是复制节点及其整个子节点树；`false`情况下则浅复制，只复制节点本身。复制后返回的节点副本归文档所有，不过没有为它指定父节点。**这个方法只复制特性，不复制事件处理程序**
5. `normalize()`，这个方法唯一的作用就是处理文档树中文本节点。当调用这个方法时，就会在被调用节点的后代节点中查找，如果找到文本节点则删除，找到相邻的文本节点则合并为一个文本节点。

## Document类型
在浏览器中`document`对象是`HTMLDocument`的一个实例，表示整个`HTML`页面。而且`document`对象是`window`对象的一个属性，因此可以将其作为全局对象来访问。
```js
var html = document.documentElement // 取得对<html>的引用
var body = document.body //取得对<body>的引用
var doctype = document.doctype //取得对<!DOCTYPE>的引用
var url = document.URL
var domain = document.domain
var referrer = document.referrer //保存着链接到当前页面的那个页面的URL
```

::: tip
不能将`domain`属性设置为`URL`不存在的域名。
当页面中包含来自其他子域名的框架或内嵌框架时，能够设置`document.domain`就可以避免跨域限制无法通信的问题。例如把`www.wrox.com`和`p2p.wrox.com`都设置`document.domain`为`wrox.com`，这样就可以通信了。

不过设置成`wrox.com`松散状态之后，再设置回去就会报错了。
:::

## jquery dom的api对应原生
1. 获取dom属性
```js
// jquery
$(element).attr('target') // 返回被选元素的属性值。
$(element).attr('target',value) // 设置

// js
document.getElementsByTagName("a")[0].getAttribute("target"); // 返回
document.getElementsByTagName("a")[0].setAttribute("target", value) // 设置
```

2. 获取dom外部宽度
```js
$(selector).outerWidth(includeMargin) // includeMargin 可选值，默认为false，即不包含margin，只有包含padding+border
// includeMargin 为false时
offsetWidth       //返回元素的宽度（包括元素宽度、内边距和边框，不包括外边距）

$(selector).innerWidth() // 
clientWidth        //返回元素的宽度（包括元素宽度、内边距，不包括边框和外边距）

$(selector).width() // 获取元素宽度
$(selector).width(value) // 设置元素宽度

dom.style.width
```

3. 方法返回或设置匹配元素的滚动条的水平位置。
滚动条的水平位置指的是从其左侧滚动过的像素数。当滚动条位于最左侧时，位置是 0。
```js
$(selector).scrollLeft() // 返回
$(selector).scrollLeft(position) // 设置 不用带单位

// 原生 设置（也可以获取）
dom.scrollLeft = value

// 也可以用scrollTo方法把内容滚动到指定的坐标。
scrollTo(xpos,ypos)
```
::: tip
这两个属性只能用于元素设置了`overflow`的`css`样式中。否者这两个属性没有任何意义。且`overflow`的值不能为`visible`，但可以为`hidden,auto,scroll`的之中，但是`hidden`最常见。
:::