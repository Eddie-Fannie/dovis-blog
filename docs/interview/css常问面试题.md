# CSS常问面试题
## CSS优先级算法
| 选择器 | 优先级 |
|--------| -----|
| 元素选择符 | 1 |
| class选择符 | 10 |
| id选择符 | 100 |
| 内联样式 | 1000 |

+ 其他规则
    - `!important`声明样式优先级最高
    - 优先级相同，看最后出现的样式
    - 继承得到的样式优先级最低
> `!important` > 内联`style` > `ID`选择器 > 类选择器 > 标签选择器 > 通配符选择器>继承

## CSS3新特性
1. 过渡，动画，变换
过渡：

| 属性 | 说明 | 值 |
|-----|------|---|
|`transition-delay` | 指定过渡开始之前的延迟时间 | 时间 |
|`transition-duration`| 指定过渡的持续时间 | 时间 |
| `transition-property` | 指定应用过渡的属性 | 字符串 |
| `transition-timing-funtion` | 指定过渡期间计算中间值的方式 | `ease ease-in ease-out ease-in-out linear` 还有一个`cubic-bezier`贝塞尔曲线 |

简写：
```bash
transition: <transition-property> <transition-duration> <transition-timing-function> <transition-delay>
```

`cubic-bezier`
```css
transition-timing-function: cubic-bezier(p0,p1,p2,p3) /*四个点*/
```

动画：

| 属性 | 说明 | 值 |
|------|-----|----|
| `animation-delay` | 设置动画开始前的延迟 | 时间 s/ms |
| `animation-direction` | 设置动画循环播放的时候是否反向播放 | `normal/alternate` |
| `animation-duration` | 设置动画播放的持续时间 | 时间 |
| `animation-iteration-count` | 设置动画的播放次数 | `infinite`/数值 |
| `animation-name` | 动画名称 | * |
| `animation-play-state` | 允许动画暂停和重新播放 | `running/paused` |
| `animation-timing-function` | 如同上面 | * |

简写：
```bash
animation: <animation-name> <animation-duration> <animation-timing-function> <animation-delay> <animation-iteration-count>
```

变换：

| 属性 | 说明 | 值 |
|------|-----|----|
| `transform` | 指定应用的变换功能 | 参考下面应用变换 |
| `transform-origin` | 指定变换的起点 | 参考下面指定元素变换起点 |

- 应用变换：

| 值 | 说明 |
|----|-----|
| `translate` | 在水平/垂直方向或者两个方向上平移元素 |
| `scale` | 在水平/垂直方向或者两个方向上缩放元素 |
| `rotate` | 旋转角度 |
| `skew` | 倾斜元素一定角度 |

- 指定元素变换起点：
> `transform-origin`允许我们指定应用变换的起点，默认情况下使用元素的中心作为起点

| 值 | 说明 |
|----|-----|
| `%` | 指定元素x/y轴的起点 |
| `left/center/right` | 指定x轴上的位置 |
| `top/center/bottom` | 指定y轴上的位置 |

2. 边框
- 创建圆角边框
```css
border-radius: 一次设置四个角简写属性，分别为`border-top-left-radius,border-top-right-radius,border-bottom-left-radius,border-bottom-right-radius`
```
> 指定两个半径值即可定义一个圆角，采用长度值和百分数值均可。第一个值指定水平曲线半径，第二个为垂直曲线半径。百分数值是相对于元素盒子的宽高来说的。

3. 背景图片
- 背景图片尺寸
> `contain`值确保图像调整尺寸后，整个图像始终包含在元素内部。浏览器判断图像长度和宽度哪个更大，并将较大者调整至容器相应长度或宽度大小。相反，如果取`cover`值，浏览器选中较小的值，并沿着该方向调整图像大小。

![img](/dovis-blog/other/17.png)

4. 盒阴影

## 常见兼容性问题
1. 不同浏览器的标签默认的`margin`和`padding`不一样。`*{margin:0;padding:0;}`
2. `Chrome` 中文界面下默认会将小于 `12px` 的文本强制按照 `12px` 显示,可通过加入 `CSS` 属性 `-webkit-text-size-adjust: none;` 解决。
::: tip
为什么要初始化`css`样式？也是为了解决兼容性问题，还要清除元素的一些默认样式。
:::

## CSS里的`visibility`属性有个`collapse`属性值
`visibility`设置为`hidden`，表示元素不可见但在页面仍会占据空间。而`collapse`表示元素不可见，但不占据空间。

1. `chrome`中，使用`collapse`值和使用`hidden`没有区别。
2. `firefox`，`opera和IE`，使用`collapse`值和使用`display：none`没有什么区别。

## `position`和`display`,`overflow`,`float`叠加使用
> `display`属性规定元素应该生成的框的类型；`position`属性规定元素的定位类型；`float`属性是一种布局方式，定义元素在哪个方向浮动。类似于优先级机制：`position：absolute/fixed`优先级最高，有他们在时，`float`不起作用，`display`值需要调整。`float` 或者`absolute`定位的元素，只能是块元素或表格。

## 浮动
> 浮动元素碰到包含它的边框或者浮动元素的边框停留。由于浮动元素不在文档流中，所以文档流的块框表现得就像浮动框不存在一样。浮动元素会漂浮在文档流的块框上。
+ 浮动带来的问题：
    - 父元素高度无法被撑开，影响与父元素同级的元素。
    - 与浮动元素同级的非浮动元素（内联元素）会跟随其后
    - 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面结构

+ 清除浮动的方式：
    - 父级`div`定义`height`
    - 最后一个浮动元素后加一个空`div`标签，并添加样式`clear:both;`
    > `clear`属性表示设置元素的左右边界不允许出现浮动元素
    - 父级元素触发`BFC`
    - 包含浮动元素的父标签添加样式`overflow:hidden/auto;`
    - 父级`div`定义伪元素和`zoom:1`
    - 建立伪类选择器
    ```html
    //添加:after伪元素
        .parent:after{
            content: ''; /* 设置添加子元素的内容是空 */  
            display: block; /* 设置添加子元素为块级元素 */       
            height: 0; /* 设置添加的子元素的高度0 */     
            visibility: hidden; /* 设置添加子元素看不见 */     
            clear: both; /* 设置clear：both */
        }
        <div class="parent">
            <div class="f"></div>
        </div>
    ```
::: tip
清除浮动——一个父元素的所有子元素如果都是浮动的，那么这个父元素是没有高度的。

（1）如果这个父元素的相邻元素是行内元素，那么这个行内元素将会在这个父元素的区域内见缝插针，找到一块放得下它的地方。
（2）如果相邻的元素是一个块级元素，那么设置这个块级元素的`margin-top`将会以这个父元素的起始位置作为起点。

+ 浮动两个特性：
    - 浮动的元素不像`absolute`定位那样，它并没有脱离正常的文档流，仍然占据正常文档流的空间。而这个空间正是正常文档流的`background`的`border`，反过来说，其它元素将会围绕着浮动的元素排列，浮动的元素就会占据着它们的背景和`border`
    - 浮动的元素虽然还在父容器的区域内排列，但它不会撑起父容器的高度，父容器的高度跟没有子元素一样都是`0px`。
:::

## 使用百分比设定单位
> 如果使用百分数设定内边距，外边距都是相对于元素父级元素的宽度来设置的，而不是高度。

## 布局
1. 多列布局（如同报纸模式）允许在多个垂直列中布局内容

| 属性 | 说明 | 值 |
|-----|-------|---|
| `column-count` | 指定列数 | 数值 |
| `column-fill` | 指定内容在列与列之间的分布方式 | `balance/auto`|
| `column-gap`| 指定列之间的距离 | 长度值 |
|`column-rule` | 列边样式的简写 | 和边框一样 |
| `columns` | 设置`column-span/column-width`简写属性 |
| `column-span` | 设置元素横向跨多少列| `None/all`|
| `column-width` | 指定列宽 | 长度值 |

2. 弹性布局
> 设定`Flex`布局以后，子元素的`float`和`clear`，`vertical-align`属性将失效。水平的叫主轴，垂直叫交叉轴。

+ 设置在容器上的属性：
    - `flex-direction`: `row/row-reverse/column/column-reverse`
    > 决定主轴的方向，即项目的排列方向
    - `flex-wrap`: `nowrap/wrap/wrap-reverse`
    > 默认项目都水平排列在主轴上，该属性定义如果一条轴线排不下如何换行。
    - `flex-flow`
    > 前两个属性的简写，默认为`row nowrap`
    - `justify-content`
    > 定义项目在主轴上的对齐方式。`flex-start/flex-end/center/space-between/space-around`
    - `align-items`
    > 定义项目在交叉轴的对齐方式。`flex-start/flex-end/center/baseline/stretch`
    ::: tip
    `baseline`：项目中第一行文字基线对齐
    `stretch`：默认值，如果项目未设置高度或设为`auto`，将占满整个容器高度。
    :::
    - `align-content`
    > 定义多根轴线的对齐方式，如果只有一个轴线，不起作用。` flex-start | flex-end | center | space-between | space-around | stretch;`

+ 设置在项目上的属性：
    - `order`
    > 定义项目的排列顺序。数值越小，排列越靠前，默认为`0`
    - `flex-grow`
    > 定义项目放大比例，默认为0，所以如果存在剩余空间，也不放大。
    ::: tip
    如果所有项目的`flex-grow`属性都为`1`，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为`2`，其他项目都为`1`，则前者占据的剩余空间将比其他项多一倍。
    :::
    - `flex-shrink`
    > 定义项目的缩小比例，默认为1。项目空间不足，则将缩小。
    - `flex-basis`。默认占多少
    > 默认值为`auto`
    - `flex`
    > 2-4属性的缩写：` flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`。后两个属性可选
    - `align-self`： `auto | flex-start | flex-end | center | baseline | stretch;`
    > 允许单个项目有与其他项目不一样的对齐方式。可以覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，没有父元素则取`stretch`

```html
<div class="container">
    <div class="left"></div> // 286
    <div class="right"></div> // 314
</div>

<style>
    * {
        padding: 0;
        margin: 0;
    }
    .container {
        width: 600px;
        height: 300px;
        display: flex;
    }
    .left {
        flex: 1 2 500px;
        background: red;
    }
    .right {
        flex: 2 1 400px;
        background: blue;
    }
</style>
```
::: tip
+ **`flex-shrink`计算方式：**
> `flex-shrink` 属性定义空间不够时各个元素如何收缩。其值默认为 `1`。`flex-shrink` 定义的仅仅只是元素宽度变小的一个权重分量。每个元素具体收缩多少，还有另一个重要因素，即它本身的宽度。

**例子：**
父元素`500px`。三个子元素分别设置为`150px，200px，300px`。三个子元素的 `flex-shrink` 的值分别为 `1，2，3`。首先，计算子元素溢出多少：`150 + 200 + 300 - 500 = -150px`。那这 `-150px` 将由三个元素的分别收缩一定的量来弥补。**具体的计算方式为：每个元素收缩的权重为其 `flex-shrink` 乘以其宽度。**所以总权重为 `1 * 150 + 2 * 200 + 3 * 300 = 1450`

+ 三个元素分别收缩：
    - `150 * 1(flex-shrink) * 150(width) / 1450 = -15.5`
    - `150 * 2(flex-shrink) * 200(width) / 1450 = -41.4`
    - `150 * 3(flex-shrink) * 300(width) / 1450 = -93.1`
+ 三个元素的最终宽度分别为：
    - `150 - 15.5 = 134.5`
    - `200 - 41.4 = 158.6`
    - `300 - 93.1 = 206.9`

同样，当所有元素的 `flex-shrink` 之和小于 `1` 时，计算方式也会有所不同：例如把收缩比例改为`0.1 0.2 0.3`，权重则为`145`。三个元素收缩总和并不是`150px`，而是只会收缩`150px` 的`(0.1 + 0.2 + 0.3) / 1`即`60%`的空间：`90px`。

+ 每个元素收缩的空间为：
    - `90 * 0.1(flex-shrink) * 150(width) / 145 = 9.31`
    - `90 * 0.2(flex-shrink) * 200(width) / 145 = 24.83`
    - `90 * 0.3(flex-shrink) * 300(width) / 145 = 55.86`

+ 三个元素的最终宽度分别为：
    - `150 - 9.31 = 140.69`
    - `200 - 24.83 = 175.17`
    - `300 - 55.86 = 244.14`

+ **`flex-grow`计算方式：**
![img](/dovis-blog/other/45.png)

![img](/dovis-blog/other/46.png)
:::

3. `grid`布局
`display:grid`指定容器采用网格布局，默认情况容器都是块级元素，也可以设置为行内元素`display: inline-grid`

+ 容器设置的属性：
    - `grid-template-columns` 定义每一列的列宽 （可以使用`repeat()`函数，`fr`关键字，`minmax()`函数，`auto`关键字）
    1. `repeat(3,33.33%)`。第一个参数为重复的次数，第二个参数为重复的值。
    2. `repeat(2, 100px 20px 80px)`。重复某种模式
    3. `repeat(auto-fill, 100px)` 自动填充。
    - `grid-template-rows`定义每一列的行高 （可以使用`repeat()`函数，`fr`关键字，`minmax()`函数，`auto`关键字）
    - `grid-gap`：`grid-column-gap`和`grid-row-gap`简写合并，表示列，行间距
    - `grid-auto-flow`属性决定，默认值为`row`，即先行后列。也可以设为`column`先列后行。
    - `justify-items`设置单元格内容的水平位置。（`start end center stretch`)
    - `align-items`则设置单元格内容垂直位置。（`start end center stretch`)
    - `place-items` 前面两个属性的简写：`align-items justify-items`(省略第二个值，浏览器认为与第一个值相等)

## 网页中使用偶数字体
>使用偶数字体。偶数字号相对更容易和 `web` 设计的其他部分构成比例关系。`Windows` 自带的点阵宋体（中易宋体）从 `Vista` 开始只提供 `12、14、16 px` 这三个大小的点阵，而 `13、15、17 px`时用的是小一号的点。（即每个字占的空间大了` 1 px`，但点阵没变），于是略显稀疏。

## 行高
> 行高是指一行文字的高度，具体说是两行文字间基线的距离。`CSS`中起高度作用的是`height`和`line-height`，没有定义`height`属性，最终其表现作用一定是`line-height`。单行文本垂直居中：把`line-height`值设置为`height`一样大小的值可以实现单行文字的垂直居中，其实也可以把`height`删除。

## `li`之间空白间隔
> 行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为`0`，就没有空格了。
+ 解决方案：
    - 将`li`标签写在一排
    - 浮动
    - 在`ul`中使用`font-size: 0;` `letter-space: -3px;`

## `link`和`@import`引入css区别：
1. **`link`引用时在页面载入时同时加载；`@import`需要页面完全载入以后再加载**，所以可能出现无样式页面。
2. 前者可以加载其他，后者只能`css`
3. 兼容性
4. 前者支持通过`js`控制`DOM`改变样式。

## `style`标签写在`body`前或者后，有什么区别？
- 一般情况下，页面加载时自上而下的。将`style`标签至于`body`之前，为的是先加载样式。
- 若是写在`body`标签之后，由于浏览器以逐行方式对`html`文档进行解析，当解析到写在写在文档尾部的样式表时，会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后会重新渲染，在`windows`的`IE`下可能会出现`FOUC`现象（页面闪烁）。

::: tip
何为`FOUC`？又如何避免？

- 当使用`@import`导入`CSS`时，会导致某些页面在`IE`出现奇怪的现象：没有样式的页面内容显示瞬间闪烁，这种现象被称为“文档样式暂时失效”，简称`FOUC`。
**产生原因：**当样式表晚于结构性`html`加载时，加载到此样式表时，页面将会停止之前的渲染。等待此样式表被下载和解析后，再重新渲染页面，期间导致短暂的花屏现象。
**解决办法：**只要在之间加上元素即可
:::

## 伪类和伪元素根本区别：
- 从我们模仿其意义的角度来看，如果需要添加新元素加以标识的，就是伪元素，反之，如果只需要在既有元素上添加类别的，就是伪类。
- 伪元素在一个选择器里只能出现一次，并且只能出现在末尾。
- 伪类则是像真正的类一样发挥着类的作用，没有数量上的限制，只要不是相互排斥的伪类，也可以同时使用在相同的元素上。
- 伪类用一个冒号表示 `:first-child`，伪元素则使用两个冒号表示 `::first-line`(为了向下兼容，现在的浏览器中伪元素选择器用单冒号和双冒号都可以)。

**常用伪元素和伪类：**
![img](/dovis-blog/other/19.png)

## `border:none`和`border: 0`的区别？
- `{border：0;}`: 把`border`设置为`0`像素，虽然在页面上看不到，但是按`border`默认值理解，浏览器依然对`border-width/border-color`进行了渲染，即已经占用内存值；
- `{border：none；}`被理解为`border-style:none`。`boder:0;`比`border:none`多渲染了一个`border-width:0`,也就是为什么`border:none`的性能要比`border:0`高；

## `px|em|rem`单位
- `px`: `px`像素（`Pixel`）。相对长度单位。像素`px`是相对于显示器屏幕分辨率而言的。
+ `em`: `em`的值并不是固定的， `em`会继承父级元素的字体大小。（浏览器`body`中`1em=16px`）
    - `body`选择器中声明`Font-size=62.5%`；
    - 将你的原来的px数值除以`10`，然后换上`em`作为单位；
    - 重新计算那些被放大的字体的`em`数值。避免字体大小的重复声明。
- `rem`: 使用`rem`相对的只是`HTML`根元素。集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。

## 图片格式
- `png`便携式网络图片`（Portable Network Graphics）`,是一种无损数据压缩位图文件格式。优点是：压缩比高，色彩好。大多数地方都可以用。
- `jpg`是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在`www`上，被用来储存和传输照片的格式。
- `gif`是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果。
- `bmp`的优点：高质量图片；缺点：体积太大；适用场景：windows桌面壁纸；
- `webp`格式是谷歌在2010年推出的图片格式，压缩率只有`jpg`的`2/3`，大小比`png`小了`45%`。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

## 实现左边竖条的方法
1. `border`
2. 伪元素
3. 内/外`box-shadow`
```css
/*内*/
div{
    box-shadow:inset 5px 0px 0 0 deeppink;
}

/*外*/
div{
    box-shadow:-5px 0px 0 0 deeppink;
}
```
4. 滤镜`drop-shadow`
```css
div{
    filter:drop-shadow(-5px 0 0 deeppink);
}
```
5. 渐变
```css
div{
    background-image:linear-gradient(90deg, deeppink 0px, deeppink 5px, transparent 5px);
}
```
6. 轮廓`outline`
> `outline` （轮廓）是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。
```css
div{
    height:50px;
    outline:5px solid deeppink;
}
div{
    position:absolute;
    content:"";
    top:-5px;
    bottom:-5px;
    right:-5px;
    left:0;
    background:#ddd;
}
```
## 超出部分省略号
单行
```css
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
word-break: break-all;
```

## zoom/scale的区别
- 控制缩放的值不一样。`zoom`更全面，但是不能是负数，只能等比例控制；而`scale`虽然只能是数值，但是能负数，可以只控制`1`个维度。
- `zoom`的缩放是相对于左上角的；而`scale`默认是居中缩放(`transfrom-origin`可以改变）；
- `zoom`的缩放改变了元素占据的空间大小；而`scale`的缩放占据的原始尺寸不变，页面布局不会发生变化；
- 对文字的缩放规则不一致。`zoom`缩放依然受限于最小`12`像素中文大小限制；而`scale`就是纯粹的对图形进行比例控制，文字`50%`原来尺寸。
- 在文档流中`zoom`加在任意一个元素上都会引起一整个页面的重新渲染，而`scale`只是在当前的元素上重绘。