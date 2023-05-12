# Vue中API的原理
## `vm.$set()`
> 由于 `Vue` 会在初始化实例时对属性执行 `getter/setter` 转化，所以属性必须在 `data` 对象上存在才能让 `Vue` 将它转换为响应式的。但是 `Vue` 提供了 `Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value)` 来实现为对象添加响应式属性

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // target 为数组  
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度, 避免索引>数组长度导致splcie()执行有误
    target.length = Math.max(target.length, key)
    // 利用数组的splice变异方法触发响应式  
    target.splice(key, 1, val)
    return val
  }
  // key 已经存在，直接修改属性值  
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // target 本身就不是响应式数据, 直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 对属性进行响应式处理
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```
- 如果目标是数组，直接使用数组的 `splice` 方法触发相应式；
- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 `defineReactive` 方法进行响应式处理（ `defineReactive` 方法就是 `Vue` 在初始化对象时，给对象属性采用 `Object.defineProperty` 动态添加 `getter` 和 `setter` 的功能所调用的方法）

## 事件相关的实例方法
### `vm.$on`
```js
vm.$on(event,callback)
```
参数：`event: string|Array<string>`；`callback: Function`

> 监听当前实例上的自定义事件，事件可以由`vm.$emit`触发。回调函数会接收所有传入事件所触发的函数的额外参数。

```js
vm.$on('test',function(msg) {
  console.log(msg)
})

vm.$emit('test','hi')
```

::: tip
事件的实现并不难，只需要在注册事件时将回调函数收集起来，在触发事件时将收集起来的回调函数依次调用即可。

```js
Vue.prototype.$on = function(event,fn) {
  const vm = this
  if(Array.isArray(event)) {
    for(let i=0;i<event.length;i++) {
      this.$on(event[i],fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn)
  }
  return vm
}
```

在上面的代码中，当`event`参数为数组时，需要遍历数组，将其中的每一项递归调用`vm.$on`，使回调可以被注册到数组中每项事件名所指定的事件列表中。当`event`参数不为数组时，就向事件列表中添加回调。通俗讲，就是将回调注册到事件列表中。

`vm._events`是一个对象，用来存储事件。在代码中，我们使用事件名（`event`）从`vm._events`中取出事件列表，如果列表不存在，则使用空数组初始化，然后再将回调函数添加到事件列表中。`vm._events`时在执行`new Vue()`时会执行`this._init`方法进行一系列初始化操作，其中就会在vue实例上创建一个`_events`属性，用来存储事件。

```js
vm._events = Object.create(null)
```
:::

### `vm.$off`
移除自定义事件监听器
```js
vm.$off([event,callback])
```
- 如果没有提供参数，则移除所有事件监听器
- 如果只提供事件，则移除事件所有监听器
- 如果同时提供事件和回调，则只移除这个回调的监听器

```js
Vue.prototype.$off = function(event,fn) {
  const vm = this
  // 没有提供参数
  if(!arguments.length) {
    vm._events = Object.create(null)
    return vm
  }
  // event支持数组
  if(Array.isArray(event)) {
    for(let i=0,l=event.length;i<l;i++) {
      this.$off(event[i],fn)
    }
    return vm
  }
  // 只提供事件时
  const cbs = vm._events[event]
  if(!cbs) return vm
  // 移除该事件所有监听器
  if(arguments.length === 1) {
    vm._events[event] = null
    return vm
  }

  // 只移除与fn相同的监听器
  if(fn) {
    const cbs = vm._event[event]
    let cb 
    let i = cbs.length
    while(i--) {
      cb = cbs[i]
      if(cb === fn || cb.fn === fn) {
        cbs.splice(i,1)
        break
      }
    }
  }
  return vm
}
```

::: tip
这里有个细节需要注意的是，在代码中遍历列表是从后向前循环，这样在列表中移除当前位置的监听器时，不会影响列表中未遍历到的监听器位置。如果是从前向后遍历，那么当从列表中移除一个监听器时，后面的监听器会自动向前移动一个位置，这样导致下一轮循环跳过一个元素。
:::

### `vm.$once`
> `vm.$once`只能被触发一次，所以实现这个功能的思路是：在`vm.$once`中调用`vm.$on`来监听自定义事件的功能，当自定义事件触发后执行拦截器，将监听器从事件列表中删除

```js
Vue.prototype.$once = function(event,fn) {
  const vm = this
  function on () {
    vm.$off(event,on)
    fn.apply(vm,arguments)
  }
  on.fn = fn
  vm.$on(event,on)
  return vm
}
```

::: tip
首先将函数`on`注册到事件中。当自定义事件被触发时，会先执行函数`on`。这个函数会使用`vm.$off`移除自定义事件，并手动执行函数`fn`。就可以实现`vm.$once`的功能。

`on.fn = fn`。这里要注意的是前面介绍`$off`时会提到在移除监听器时会对比用户提供的监听器函数和列表中的是否一致，这导致使用拦截器代替监听器注入到事件列表中就会使得拦截器和用户提供的不一致，移除操作就会失效。

所以才在`vm.$off`会有`cb.fn === fn`这个判断。
:::

### `vm.$emit`
```js
vm.$emit(event, [...args])
```
触发当前实例上的事件。附加参数都会传给监听器回调。

::: tip
实现思路是使用事件名从`vm._events`中取出对应的事件监听器回调函数列表，然后依次执行列表中的监听器回调并将参数传递给监听器回调。

```js
Vue.prototype.$emit = function(event) {
  const vm = this
  let cbs = vm._events[event]
  if(cbs) {
    const args = toArray(arguments,1) // 类数组转数组，去除第一项
    for(let i = 0,l=cbs.length;i<l;i++) {
      try {
        cbs[i].apply(vm,args)
      } catch(e) {
        handleError(e,vm,`event handler for ${event}`)
      }
    }
  }
  return vm
}
```
:::

## `Vue.use`
`Vue` 提供了 `Vue.use` 的全局 `API` 来注册这些插件，所以我们先来分析一下它的实现原理，定义在 `vue/src/core/global-api/use.js` 中

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    console.log(arguments)
    const args = toArray(arguments, 1) // 把类数组转为数组 arguments是Vue.use这个方法的
    args.unshift(this) // 将vue插入到参数第一位置
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```
`Vue.use` 接受一个 `plugin` 参数，并且维护了一个 `_installedPlugins` 数组，它存储所有注册过的 `plugin` ；接着又会判断 `plugin` 有没有定义 `install` 方法，如果有的话则调用该方法，并且该方法执行的第一个参数是 `Vue`；最后把 `plugin` 存储到 `installedPlugins` 中。

**可以看到 `Vue` 提供的插件注册机制很简单，每个插件都需要实现一个静态的 `install` 方法，当我们执行 `Vue.use` 注册插件的时候，就会执行这个 `install` 方法，并且在这个 `install` 方法的第一个参数我们可以拿到 Vue 对象，这样的好处就是作为插件的编写方不需要再额外去 `import Vue` 了。**

## `Vue.mixin`
`Vue.mixin` 的定义，在 vue/src/core/global-api/mixin.js 中

```js
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```
它的实现实际上非常简单，就是把要混入的对象通过 `mergeOptions` 合并到 `Vue` 的 `options` 中，由于每个组件的构造函数都会在 `extend` 阶段合并 `Vue.options` 到自身的 `options` 中，所以也就相当于每个组件都定义了 `mixin` 定义的选项。