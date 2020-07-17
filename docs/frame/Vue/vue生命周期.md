# vue生命周期
> 每个`vue`实例在被创建之前都要经过一系列的初始化过程。设置数据监听，编译模板，挂载实例到`DOM`中，在数据变化时更新`DOM`等。

![img](/dovis-blog/vue/lifecycle.png)

## `beforeCreate`&`created`
> `beforeCreate`和`created`函数都是在实例化`Vue`的阶段，在`_init`方法中执行的，**初始化阶段**

```js
Vue.prototype._init = function(options?: Object) {
    // ....
     initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    // ....
}
```
可以看到`beforeCreated`和`created`钩子调用分别在`initState`前后，`initState`作用是初始化`props`，`data`，`methods`，`watch`，`computed`等属性。