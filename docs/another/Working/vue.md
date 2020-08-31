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

4. vue中使用可选链操作符
在`template`中使用（目前`Vue`默认是不支持在`template`中使用可选链操作符的，如果我们想要实现可选链操作符类似的效果，需要绕一个弯，具体代码如下）
```js
// utils.js
/**
 * 解决Vue Template模板中无法使用可选链的问题
 * @param obj
 * @param rest
 * @returns {*}
 */
export const optionalChaining = (obj, ...rest) => {
  let tmp = obj;
  for (let key in rest) {
    let name = rest[key];
    tmp = tmp?.[name];
  }
  return tmp || "";
};

// main.js
import {optionalChaining} from "./utils/index";
 
Vue.prototype.$$ = optionalChaining;

// .vue
<template>
    <div class="container">
        <div class="username">{{$$(userInfo,"friends",0,"userName")}}</div>
    </div>
</template>
 
<script>
    export default {
        name: "test",
        data(){
            return {
                userInfo:{}
            }
        }
    }
</script>
 
<style scoped>
 
</style>
```