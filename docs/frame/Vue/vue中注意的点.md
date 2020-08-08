# vue中注意的点

## 生命周期
1. `created`阶段的`ajax`请求与`mounted`请求的区别：前者页面视图未出现，如果请求信息过多，页面会长时间处于白屏状态
2. `mounted` 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 `vm.$nextTick`
3. 父子组件生命周期：
::: tip
- 仅当子组件完成挂载后，父组件才会挂载
- 当子组件完成挂载后，父组件会主动执行一次`beforeUpdate/updated`钩子函数（仅首次）
- 父子组件在data变化中是分别监控的，但是在更新`props`中的数据是关联的（可实践）
- 销毁父组件时，先将子组件销毁后才会销毁父组件
:::

4. 兄弟组件生命周期：
::: tip
- 组件的初始化（`mounted`之前）分开进行，挂载是从上到下依次进行
- 当没有数据关联时，兄弟组件之间的更新和销毁是互不关联的
:::

5. 宏`mixin`的生命周期
::: tip
`mixin`中的生命周期与引入该组件的生命周期是紧紧关联的，且`mixin`的生命周期优先执行
:::

## watch
> 监听数据必须是`data`中声明过或者父组件传递过来的`props`中的数据，当数据变化时，触发其他操作，函数有两个参数
1. `immediate`的作用：当值第一次进行绑定的时候并不会触发`watch`监听，使用`immediate`则可以在最初绑定的时候执行。
2. `watch` 的 `deep` 属性,深度监听,也就是监听复杂数据类型
>  `deep`的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改`obj`里面任何一个属性都会触发这个监听器里的 `handler`，所以就可以使用字符串形式监听。
```js
watch:{
  inpValObj:{
    handler(oldVal,newVal){
      console.log(oldVal)
      console.log(newVal)
    },
    deep:true
  }
}
```
::: tip
此时发现`oldVal`和 `newVal` 值一样;
因为它们索引同一个对象/数组,`Vue` 不会保留修改之前值的副本;
所以深度监听虽然可以监听到对象的变化,但是无法监听到具体对象里面那个属性的变化
:::

## vue-router
传参数：`name/params`或者`path/query`，后者刷新不会丢参数。

## 其他
1. `v-cloak`
> 在网速慢的情况下,在使用`vue`绑定数据的时候，渲染页面时会出现变量闪烁。用法:这个指令保持在元素上直到关联实例结束编译。

2. `router-view`的`key`
> 由于 `Vue` 会复用相同组件, 即 `/page/1 => /page/2` 或者 `/page?id=1 => /page?id=2` 这类链接跳转时, 将不再执行`created, mounted`之类的钩子

```js
<router-view :key="$route.fullpath"></router-view> // 这样组件的 created 和 mounted 就都会执行
```

3. 场景:在`Vue`开发过程中, 经常会遇到`template`模板渲染时`JavaScript`变量出错的问题, 此时也许你会通过`console.log`来进行调试。这时可以在开发环境挂载一个 `log` 函数
```js
// main.js
Vue.prototype.$log = window.console.log;

// 组件内部
<div>{{$log(info)}}</div>
```