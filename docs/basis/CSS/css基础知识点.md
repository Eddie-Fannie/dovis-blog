# CSS基础知识点
## 居种方式
### 水平居中
1. 内联元素水平居中
> 在块级元素中的内联元素居中，对块级元素使用`text-align: center`即可实现内联元素水平居中显示。

2. 块级元素水平居中
> 通过把固定宽度块级元素的`margin-left margin-right`设置为`auto`即可使块级元素水平居中。

::: tip
为什么`auto`值就可以让元素相对于父元素水平居中?
**`auto`值有0/父元素剩余空间的宽度。**
- 当元素的布局方式为`static/relative`或者宽高已知，`auto`取值后者；
- 当元素宽高未知，或者布局方式为`absoulte/fixed`，或者浮动。`auto`取值前者。
:::

3. 多块级元素水平居中
> 把块级元素的显示类型设置为`inline-block`，然后设置父容器的`text-align`为居中。

> 利用`display:flex`

### 垂直居中
1. 单行内联元素`inline-block`垂直居中
> 通过设置该元素的高度和行高相等即可。

2. 多行元素垂直居中

### 水平垂直居中
1. 绝对定位方案
::: tip
设置操作子元素为绝对定位，`top:50%;left:50%;`这个时候还没有居中，还需要单独设置子元素的`margin`值为负值：`margin-left: -width/2;margin-top:-height/2;`
:::

2. 利用`margin: auto`
前面介绍了`auto`的取值情况，要注意`margin: 0 auto;`指水平居中，垂直是不会自动填充居中的。所以如何利用`auto`实现元素水平垂直居中。**那么就是让子元素具有流体特性，换言之就是让其绝对定位，然后设置该子元素`margin:auto`**

3. 利用动画属性
如果不知道元素的宽高，那么可以利用`transform`属性来达到元素水平垂直居中的目的。
```css
#center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```
> `translate` 接受两个参数，分别对应元素沿 `X` 轴的移动量和沿 `Y` 轴的移动量。这里我们两个都填了 `50%`，意思就是元素需要横向/纵向分别移动自身宽度/高度的 `50%`。

4. `table`布局
5. 利用绝对定位，设置四个方向的值都为`0`，并将`margin`设置为`auto`，由于宽高固定，因此对应方向实现平分，可以实现水
平和垂直方向上的居中。

## `vertical-align`
> 其实`vertical-align`是用来设置行内元素对齐方式的。说白了就是`display`属性值为`inline、inline-block、inline-table`另加一个`table-cell`的元素。

**基线:**
![img](/dovis-blog/other/16.jpg)

- 在文本之类内联元素中，基线是字符`x`的下边缘位置
- 在像`img`元素中基线就是下边缘。
- 在`inline-block`元素中，也分两种情况
    + 如果该元素中有内联元素，基线就是最后一行内联元素的基线。
    + 如果该元素内没有内联元素或者`overflow`不是`visible`，其基线就是`margin`的地边缘。

```html
<div id="container" style="background: yellow;">
    x
    <img src='http://api.kingdee.com/kdrive/user/file/public?client_id=200547&file_id=143368796&scode=VVltV1dZMmFYVC9wNVI1Qy83OFE4&sign=ff4e93995c2f35211e45037cf3819dc9eb7a3af8'>
    <span style="display: inline-block;">vertical</span>
    <span style="display: inline-block;overflow: hidden;height: 80px;">linjiaheng</span>
</div>
```

![img](/dovis-blog/other/40.png)
::: tip
`x`字符的下边缘，`img`元素的底边，有内容的`inline-block`元素都是对齐的，`overflow`不是`visible`的`inline-block`元素的基线是`margin`的底边缘。细心的会发现，那么为什么最下面有个空隙呢，那是因为第三个元素基线虽然对齐，但是基线并不是元素的底边。所以下面被默认的行高撑开了。
:::

第三个元素向上移动，第四个元素取值`middle`:

![img](/dovis-blog/other/41.png)

**`vertical-align`取值**
- 正值基线就向上移动，如果是负值基线向下移动。**元素基线相对于行盒子基线向上或向下移动指定的距离。**
- 百分比值：正负情况和长度值一样，需要知道的值是相对于行高`（line-height）`的百分比。
- `top`：内联元素的顶边和行内最高元素的顶边对齐
> 1、是和最高元素的顶边而不是和行的顶边对齐。因为设置了行的`padding-top`之后元素并没有顶在最上面；2、最高元素的顶边包括`margin`，别忘了内联元素有行高
- `bottom`：元素底边和行的底边对齐
- `middle`：元素上下边的中心点和行基线向上`1/2x`的高度位置对齐。
- `text-top`：元素顶边和父级的内容区域顶边对齐
- `text-bottom`：元素底部和父级的内容区域底部对齐
- `baseline`：元素基线与行盒子基线重合
- `sub`：元素基线移动至行盒子基线下方
- `super`；元素基线移动至行盒子基线上方

**修改滚动条默认样式**
```css
@mixin scrollBar {
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track{
        background: #F3F7FF;
        border-radius:2px;
        -webkit-border-radius:2px;
        -moz-border-radius:2px;
        -ms-border-radius:2px;
        -o-border-radius:2px;
    }
    &::-webkit-scrollbar-thumb{
        background: #D9D9D9;
        border-radius:10px;
    }
    &::-webkit-scrollbar-thumb:hover{
        background: #D9D9D9;
    }
}
```