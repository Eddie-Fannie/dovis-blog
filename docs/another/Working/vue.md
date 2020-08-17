# Vue开发项目过程遇到的问题
1. 如何使用`lodash`

![img](/dovis-blog/other/14.png)

2. 使用`element.scrollIntoView()`
> 让当前的元素滚动到浏览器窗口的可视区域内。

3. 使用`element`输入框
- `vue`监听`el-input`输入框的回车事件：`@keyup.enter.native="方法名"`
- 当一个 `form` 元素中只有一个输入框时，在该输入框中按下回车会提交该表单。如果希望阻止这一默认行为，可以在标签上添加 `@submit.native.prevent`。或者为表单元素增加属性 `onSubmit="return false"`。
```html
<el-form @submit.native.prevent>
.....
</el-form>
```