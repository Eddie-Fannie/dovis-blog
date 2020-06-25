# vue的虚拟dom和虚拟节点VNode

## 什么是虚拟dom
> 通过js对象模拟出一个我们需要渲染到页面上的dom树的结构，实现了一个修改js对象即可修改页面dom的快捷途径，避免了我们手动再去一次次操作dom-api的繁琐，而且其提供了`diff`算法可以使得用最少的dom操作进行修改。

1. 虚拟DOM解决方式就是通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染。在渲染之前，会使用新生成的虚拟节点树和上一次生成的虚拟节点树进行对比，只渲染不同的部分。

2. 虚拟节点树其实是由组件树建立起来的整个虚拟节点（Virtual Node,简写vnode）树

3. 虚拟DOM除了它的数据结构定义，映射到真实的DOM实际上要经历VNode的`create`,`diff`,`patch`等过程。VNode的create是通过`createElement`方法创建的。

## vue.js中的虚拟dom
> 在vue.js中，我们使用模板来描述状态与DOM之间的映射关系。Vue.js通过编译将模板转换成渲染函数`createElement`，执行渲染函数就可以得到一个虚拟节点树，使用这个虚拟节点树就可以渲染页面。（通过`patch`把虚拟节点渲染成视图）

> 为了避免不必要的DOM操作，虚拟DOM在虚拟节点映射到视图的过程中，将虚拟节点与上一次渲染视图所使用的旧虚拟节点（oldVnode）做对比，找出真正需要更新的节点来进行DOM操作，从而避免操作不用修改的DOM。

## `createElement`方法
Vue.js利用`createElement`方法创建VNode
![img](/dovis-blog/vue/2.png)

`createElement`方法实际上是对`_createElement`的封装，允许传入的参数更加灵活，处理这些参数之后，调用真正创建VNode的函数就是`_createElement`
![img](/dovis-blog/vue/3.png)

**五个参数类型**
- `context`表示VNode的上下文环境，是Component的类型；
- `tag`表示标签，可以是一个字符串，也可以是一个`Component`；
- `data`表示VNode的数据；
- `children`表示当前的VNode的子节点，任意类型；
- `normalizationType`表示子节点规范的类型

## 什么是VNode
> 在Vue.js中存在一个VNode类，使用它可以实例化不同类型的vnode实例，而不同类型的vnode实例各自表示不同类型的DOM元素。
![img](/dovis-blog/vue/4.png)

**Vue.js对状态采取中等粒度的侦测策略。当状态发生变化，只通知到组件级别，然后组件内使用虚拟DOM来渲染视图。Vue1采取细粒度，这样一个细小的状态发生变化，都会利用`watcher`侦测，大大消耗了内存。但如果一个组件只有一个状态发生变化，整个组件就要重新渲染，这样也会造成很大的性能损耗，所以对vnode进行缓存就尤为重要了。**

## VNode类型
+ vnode类型
    - 注释节点
    - 文本节点
    - 元素节点
    - 组件节点
    - 函数式组件
    - 克隆节点
> 因为通过VNode类实例的vnode实例对象，只是有效属性不同罢了。因为通过参数为实例设置属性时，无效的属性默认被赋值为`undefined`和`false`，无效属性直接忽略就好。
![img](/dovis-blog/vue/5.png)

### 注释节点
```js
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```
**可以看出一个注释节点只有`text`和`isComment`两个有效属性。**
例如：
```html
<!-- 注释节点 -->
```
所以vnode对应
```js
{
    text: '注释节点',
    isComment: true
}
```
### 文本节点
```js
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```
**可以看出文本节点只有`text`属性**

### 克隆节点
> 克隆节点是将现有节点的属性复制到新节点，让新创建的节点和被克隆节点的属性保持一致，从而实现克隆效果。它的作用是优化静态节点和插槽节点。
```js
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
```
> 以静态节点为例子，当组件内的某个状态发生改变后，当前组件会通过虚拟DOM重新渲染视图，静态节点因为内容没有改变所以就没必要执行渲染函数重新生成vnode。因此这个时候就可以使用克隆节点将vnode克隆一份，使用克隆节点进行渲染。**这样就不用重新执行渲染函数生成新的静态节点vnode，从而提升一定性能**

**克隆节点和被克隆节点唯一区别就是`isCloned`属性，前者为`true`，后者为`false`**

## 为什么使用虚拟DOM
之所以需要使用状态生成VNode，是因为如果直接用状态生成真实`DOM`，会有一定程度的性能浪费。而先创建虚拟节点再渲染视图，就可以将虚拟节点缓存，然后使用新创建的虚拟节点和上一次渲染时缓存的虚拟节点进行对比，然后根据对比结果只更新需要更新的真实DOM节点，从而避免不必要的DOM操作，节省一定的性能开销。