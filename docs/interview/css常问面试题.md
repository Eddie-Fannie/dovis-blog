# CSS常问面试题
## CSS优先级算法
| 选择器 | 优先级 |
|--------| -----|
| 元素选择符 | 1 |
| class选择符 | 10 |
| id选择符 | 100 |
| 元素标签 | 1000 |

+ 其他规则
    - `!important`声明样式优先级最高
    - 优先级相同，看最后出现的样式
    - 继承得到的样式优先级最低

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
    - 包含浮动元素的父标签添加样式`overflow:hidden/auto;`
    - 父级`div`定义为在`zoom`

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
    - `flex-basis`
    > 默认值为`auto`
    - `flex`
    > 2-3属性的缩写：` flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`。后两个属性可选
    - `align-self`： `auto | flex-start | flex-end | center | baseline | stretch;`
    > 允许单个项目有与其他项目不一样的对齐方式。可以覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，没有父元素则取`stretch`

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