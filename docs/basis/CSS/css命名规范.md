> 平时在开发`vue`前端项目时，经常会使用`element-ui` UI库进行界面开发，大大提高生产效率。开发的时候会使用不少的组件，接下来将利用常用的`Input`输入框进行css命名规范`BEM`的介绍。
>
> **下面是element-ui官网的一个输入框例子：** 
>
> ```javascript
> <el-input v-model="input" placeholder="请输入内容"></el-input>
> 
> <script>
> export default {
> data() {
>  return {
>    input: ''
>  }
> }
> }
> </script>
> ```
>
> **这段代码在浏览器`Elements`	调试工具下是这样的：** 
>
> ```html
> <div data-v-457df2b4="" class="el-input">
> <input type="text" autocomplete="off" placeholder="请输入内容" class="el-input__inner"></div>
> ```

### css命名规范BEM

可以发现element-ui的class选择器都是运用了BEM命名规范。`BEM` 代表“块（block），元素（element），修饰符（modifier）”。在选择器中，使用以下三种符号来表示扩展关系：

> 1. 中划线：仅作为连字符，表示某个块或者某个子元素的多单词之间的连接记号。`-`
> 2. 双中划线：用来描述一个块或者块的子元素的一种状态。`--`
> 3. 双下划线：用来连接块和块的子元素

#### 块（block）

一个块是设计或布局的一部分，有具体且唯一的意义，要么就是语义上，要么是视觉上。例如上述例子的输入框块`input`

在大多数情况下，任何块的容器会有一个唯一的`css`类名，也就是这个块的名字。例如`el-input`

而`el`是块类名的前缀，这些前缀在css中有类似命名空间的作用。这里可以理解是开源组件库名字`element-ui`的前缀缩写。

#### 元素（element）

块中的子元素是块的子元素，并且子元素的子元素在BEM规范里也被认为是块的直接子元素。一个块中元素的类名必须使用父级块的名称作为前缀。又正如上面解释所说的一样，双下划线是用来连接块和块的子元素，所以代码例子第二个class类名定义为`el-input__inner` 就再正常不过了。

#### 修饰符（modifier）

一个修饰符可以理解为一个块的特定状态，标识着它有一个特定的属性。例如一个表示按钮的块默认有小，中，大三种尺寸，为了避免创建三个不同的块，就加上修饰符，如size（名字）和值（small，big,noraml)

```htl
<el-button size="small">小型按钮</el-button>
```

```html
<button data-v-457df2b4="" type="button" class="el-button el-button--default el-button--small"><!----><!----><span>小型按钮</span></button>
```

这个时候类名`el-button--small` 就利用了双中划线，small就是修饰符。