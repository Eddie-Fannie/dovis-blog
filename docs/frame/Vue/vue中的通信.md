# Vue中的通信
## `props`
> 父传子的属性，`props`可以是一个数组或者对象

## `$emit`
> 触发子组件触发父组件传给自己绑定的事件，其实就是子传父的方法

## `vuex`

## `$attrs`和`$listeners`
> 默认情况下父作用域的不被认作 `props` 的 `attribute` 绑定 (`attribute bindings`) 将会“回退”且作为普通的 `HTML attribute` 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 `inheritAttrs` 到 `false`，这些默认行为将会被去掉。
1. `$attrs`
如果父传子很多值，那么需要定义多个`props`。这个时候可以利用`$attrs`获取父传子且未在`props`中定义的值。(`class`和`style`除外)
2. `$listeners`
子组件需要调用父组件的方法。
> 父组件的方法可以通过 `v-on="$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。**`$listeners` 包含了父作用域中不含 `.native` 修饰的 `v-on `事件监听器**

```js
// 父组件
<home @change="change" />

// 子组件
mounted() {
    console.log(this.$listeners) // 可以拿到change事件
}
```

## `provide/inject`

## `$parent/$children`
::: tip
`$children`和`$parent` 并不保证顺序，也不是响应式的
只能拿到一级父组件和子组件
:::

## `$refs`
## `$root`
## `sync`
```js
// 父组件
<home :title.sync="title" />
// 编译扩展为
<home :title="title" @update:title="val => title =val" />

// 子组件
// 所以子组件可以通过$emit触发update方法改变
mounted() {
    this.$emit("update:title", '这是新的title')
}
```

## v-slot
## `EventBus`
1. 就是声明一个全局Vue实例变量 `EventBus` , 把所有的通信数据，事件监听都存储到这个变量上;
2. 类似于 `Vuex`。但这种方式只适用于极小的项目
3. 原理就是利用`$on`和`$emit` 并实例化一个全局 `vue` 实现数据共享
4. 可以实现平级,嵌套组件传值,但是对应的事件名`eventTarget`必须是全局唯一的
```js
// main.js
Vue.prototype.$eventBus = new Vue()

// 传值组件
this.$eventBus.$emit('eventTarget','这是传过来的值')

//接收组件
this.$eventBus.$on('eventTarget', v=>{
    console.log('eventTarget', v) 
})
```
## `broadcast和dispatch`

