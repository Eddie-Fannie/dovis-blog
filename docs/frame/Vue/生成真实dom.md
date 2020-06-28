# 如何生成真实DOM
[虚拟DOM](/dovis-blog/frame/Vue/虚拟dom)最核心的部分是`patch`（patching算法），可以将vnode渲染成真实的DOM。

## update
> Vue的`_update`是实例的⼀个私有⽅法，它被调⽤的时机有2个，⼀个是⾸次渲染，⼀个是数据更新的时候；由于我们这⼀章节只分析⾸次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及。`_update`⽅法的作⽤是把VNode渲染成真实的DOM。

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

## patch
> patch不是暴力替换节点，而是在现有DOM上进行修改来达到渲染视图的目的。对现有DOM进行修改需要做三件事：

- 创建新增的节点；
- 删除已经废弃的节点；
- 修改需要更新的节点；

### 新增节点
> 只有那些因为状态的改变而新增的节点在DOM并不存在时，我们才需要创建一个节点并插入到`DOM`中。

1. 当`oldVnode`不存在时，直接使用vnode创建元素并渲染视图。
2. 当`vnode`和`oldVnode`完全不是同一个节点时，需要使用`vnode`生成真实的`DOM`元素并将其插入到视图当中。

### 删除节点
> 当一个节点只在`oldVnode`中存在时，我们需要把它从DOM节点中删除。所以vnode不存在的节点都属于被废弃的节点，而被废弃的节点需要从DOM中删除。**当`oleVnode`和`vnode`完全不是同一个节点时，在DOM中需要使用vnode创建新节点替换oldVnode所对应的旧节点，而替换过程是将新创建的DOM节点插入到旧节点的旁边，然后再将旧节点删除，从而完成替换过程。**

### 更新节点
> 当新旧两个节点是相同的节点时，我们需要对这两个节点进行比较细致的比对，然后对`oldVnode`在视图中所对应的真实节点进行更新。

## 创建节点
上面是介绍了什么情况下创建元素并渲染到视图，接下来将介绍创建元素到渲染视图的过程。

> 前面介绍过vnode是有类型的，所以在创建DOM元素时，最重要的事是根据vnode类型来创建出相同类型的DOM元素，然后将元素插入到视图中。**事实上只有元素节点，文本节点，注释节点会被创建并插入到DOM中**

- 判断vnode是否有`tag`属性，有就是元素节点。调用当前环境下的（因为vue有两种环境，浏览器下的就是`document.createElement`)来创建真实的元素节点。当一个元素节点创建完之后，接下来的就是把它插入到指定的父节点中去。
> 调用当前环境下的`appendChild`方法（浏览器是`parentNode.appendChild`）就可以将一个元素插入到指定父节点中。

> 元素节点通常都有子节点（children），所以当一个元素节点被创建后，我们需要将它的子节点也创建出来并插入到这个刚创建的节点下面。创建子节点是个递归过程，把vnode的children属性循环遍历一遍，将每个子vnode都执行一次创建元素的逻辑，就可以创建子节点。

- 当发现一个vnode不存在`tag`属性时，就可以判断是否存在`isComment`属性，true则为注释节点。调用当前环境下的`createComment`（浏览器下的`document.createComment`）来创建真实的注释节点并插入指定父节点中。否则调用`docuement.createTextNode`创建文本节点。

## 删除节点
详细介绍一下元素如何从视图中删除的。