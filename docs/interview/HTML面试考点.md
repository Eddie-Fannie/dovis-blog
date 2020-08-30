# 前端面试HTML问什么

> 1. href和src有什么区别

平时业务开发的时候会经常引入一些资源文件，常见的引用方式就是通过`src`和`href`来引用
- `href`:`Hypertext Reference`的缩写，超文本引用，它指向一些网络资源，建立了和当前元素或者说是本文档的链接关系。加载的时候浏览器不会停止对当前文档的处理，会继续往下走，这也是为什么浏览器会并行地下载
`CSS`而不会阻塞页面解析，因此建议引用`CSS`使用`<link>`而不是`@import`
- `src`: `Source`，表示对资源的引入，它指向的内容会嵌入当前标签所在的位置。由于`src`的内容是页面的不可缺少的一部分，因此浏览器在解析`src`时会停下来对后续文档进行处理，直到`src`的内容加载完毕。所以才建议`js`文件放在`HTML`文档最后面。

> 2. 为什么`HTML5`不需要`DTD(Document Type Definition文档类型定义)`
`HTML5`没有使用`XML/SGML`，不需要参考`DTD`，只需要在文档类型代码中告诉浏览器这是`HTML5`文档
```html
<!DOCTYPE html>
```

> 3. `HTML`标签相关的操作判断题目
- 统计HTML标签中以b开头的标签数量
- 统计HTML标签中出现次数最多的标签
- 判断`DOM`标签的合法性
    + 标签的闭合
    + `span`标签不能有`div`
    + 其他符合HTML标签合法性的规则
::: tip
> 在`DOM`中根据标签去获取元素的原生`api`是 `getElementsByTagName()`，它返回的是一个包含所有给定标签名称的元素 `HTML`集合`HTMLCollection[1]`, 整个文件结构都会被搜索，包括根节点。我们可以通过`document.getElementsByTagName('*')`来获取当前文档中的所有标签。

第一个小问题：
```js
const tags = document.getElementsByTagName('*');
// 要使用数组的方法必须将类数组转为真正的数组
const value = [...tags].filter((item) => item.tagName.startsWith('B'))
```

第二个问题就可以利用`map`数据结构来判断，这里也可以利用对象来存储。
:::