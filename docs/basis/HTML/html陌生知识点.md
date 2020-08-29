# 一些HTML没使用的知识点

## 属性
1. html里面的role本质上是增强语义性，当现有的`HTML`标签不能充分表达语义性的时候，就可以借助role来说明。通常这种情况出现在一些自定义的组件上，这样可以增强组件的可访问性，可用性和可交互性。`role`的作用是描述一个非标准的tag实际作用。

## 标签
- `form`可以用来表单提交进行提交请求。
```js
<form action="form_action.asp" method="get">
  First name: <input type="text" name="fname" />
  Last name: <input type="text" name="lname" />
  <button type="submit" value="Submit">Submit</button>
  <button type="reset" value="Reset">Reset</button>
</form>
```