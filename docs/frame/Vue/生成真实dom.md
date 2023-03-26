# 如何生成真实DOM （`patch`)
[虚拟DOM](/dovis-blog/frame/Vue/虚拟dom)最核心的部分是`patch`（patching算法），可以将`vnode`渲染成真实的`DOM`。

## update
> Vue的`_update`是实例的⼀个私有⽅法，它被调⽤的时机有2个，⼀个是⾸次渲染，⼀个是数据更新的时候；由于我们这⼀章节只分析⾸次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及。`_update`⽅法的作⽤是把`VNode`渲染成真实的`DOM`。

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

## patch （双端对比）
> `patch` 不是暴力替换节点，而是在现有 `DOM` 上进行修改来达到渲染视图的目的。对现有 `DOM` 进行修改需要做三件事：

- 创建新增的节点；
- 删除已经废弃的节点；
- 修改需要更新的节点；

1. 比较只会在同层级进行, 不会跨层级比较
2. 在`diff`比较的过程中，循环从两边向中间比较

:::tip
`Diff` 函数调用流程:
- `patch`
- `patchVnode`
- `updateChildren`

> 在 `patch` 函数里比较的是新老虚拟 `DOM` 是否是 `key` 相同以及 `tag` 相同，如果不相同那么就直接替换，如果相同用 `patchVnode`
:::

`patchVnode` 真正的 `Diff` 算法：

```js
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  if (oldVnode === vnode) {
    return
  }

  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  const elm = vnode.elm = oldVnode.elm

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) { // 新虚拟 DOM 有子节点
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(ch)
      }
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) { // 如果新虚拟 DOM 是文本节点，直接用 textContent 替换掉
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

### 新增节点
> 只有那些因为状态的改变而新增的节点在 `DOM` 并不存在时，我们才需要创建一个节点并插入到`DOM`中。

1. 当`oldVnode`不存在时，直接使用 `vnode` 创建元素并渲染视图。
2. 当`vnode`和`oldVnode`完全不是同一个节点时，需要使用`vnode`生成真实的`DOM`元素并将其插入到视图当中。

### 删除节点
> 当一个节点只在`oldVnode`中存在时，我们需要把它从 `DOM` 节点中删除。所以 `vnode` 不存在的节点都属于被废弃的节点，而被废弃的节点需要从 `DOM` 中删除。**当`oldVnode`和`vnode`完全不是同一个节点时，在 `DOM` 中需要使用 `vnode` 创建新节点替换 `oldVnode` 所对应的旧节点，而替换过程是将新创建的 `DOM` 节点插入到旧节点的旁边，然后再将旧节点删除，从而完成替换过程。**

### 更新节点
> 当新旧两个节点是相同的节点时，我们需要对这两个节点进行比较细致的比对，然后对`oldVnode`在视图中所对应的真实节点进行更新。

## 创建节点
上面是介绍了什么情况下创建元素并渲染到视图，接下来将介绍创建元素到渲染视图的过程。

> 前面介绍过 `vnode` 是有类型的，所以在创建DOM元素时，最重要的事是根据`vnode`类型来创建出相同类型的DOM元素，然后将元素插入到视图中。**事实上只有元素节点，文本节点，注释节点会被创建并插入到`DOM`中**

- 判断`vnode`是否有`tag`属性，有就是元素节点。调用当前环境下的（因为vue有两种环境，浏览器下的就是`document.createElement`)来创建真实的元素节点。当一个元素节点创建完之后，接下来的就是把它插入到指定的父节点中去。
> 调用当前环境下的`appendChild`方法（浏览器是`parentNode.appendChild`）就可以将一个元素插入到指定父节点中。

> 元素节点通常都有子节点（`children`），所以当一个元素节点被创建后，我们需要将它的子节点也创建出来并插入到这个刚创建的节点下面。创建子节点是个递归过程，把`vnode`的`children`属性循环遍历一遍，将每个子`vnode`都执行一次创建元素的逻辑，就可以创建子节点。

- 当发现一个`vnode`不存在`tag`属性时，就可以判断是否存在`isComment`属性，`true`则为注释节点。调用当前环境下的`createComment`（浏览器下的`document.createComment`）来创建真实的注释节点并插入指定父节点中。否则调用`document.createTextNode`创建文本节点。

## 删除节点
```js
function removeVnodes (vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch)
        invokeDestroyHook(ch)
      } else { // Text node
        removeNode(ch.elm)
      }
    }
  }
}

function removeNode (el) {
  const parent = nodeOps.parentNode(el)
  // element may have already been removed due to v-html / v-text
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el)
  }
}

const nodeOps = {
  removeChild (node: Node, child: Node) {
    node.removeChild(child)
  }
  parentNode (node: Node): ?Node {
    return node.parentNode
  }
}
```
> 删除 `vnodes` 数组中从 `startIdx` 指定的位置到 `endIdx` 指定位置的内容。`removeNode`用于删除视图中的单个节点，`removeVnodes`用于删除一组指定节点。

## 更新节点
### 静态节点
> 如果新旧两个vnode都是静态节点，那么就不需要进行更新操作，可以直接跳过更新节点的过程。**静态节点就是指那些一旦渲染到界面上之后，无论日后状态如何变化，都不会发生变化的节点**

### 新`vnode`有文本属性
这种情况就直接调用`setTextContent`方法（浏览器下是`node.textContent`）来将**视图中DOM节点内容**改为虚拟节点的`text`属性所保存的文字。如果之前的旧节点也是文本，并且内容和新节点文本相同，那么就不需要执行 `setTextContent`了。

### 新`vnode`无文本属性
新`vnode`若无文本属性，则为一个元素节点。一般元素节点会有`children`属性，也可能没有，所以分两种情况。

1. **有`children`属性**
这个时候就要看旧虚拟节点`oldVnode`是否有`children`属性了。如果有则要把新旧虚拟节点的子节点进行详细的对比并更新[（详细讲解）](#更新子节点)；如果没有`children`属性，则为一个空元素节点或者为一个文本节点。如果是文本节点，则把文本清空变成空标签，然后将新`vnode`的`children`循环遍历创建成真实的`DOM`元素节点并插入到视图中的`DOM`节点下面。

2. **没有`children`属性**
当新`vnode`没有`children`属性时，该新节点为一个空节点。这时旧虚拟节点`oldVnode`中有子节点就删除子节点，有文本就删除文本，总之有什么删除什么。

## 更新子节点
> 对比两个子节点列表，首先需要做的事情是循环。循环`newChildren`（新子节点列表），每循环到一个新节点，就去`oldChildren`中找到和当前节点相同的那个旧子节点。如果找不到，说明当前子节点是由于状态变化而新增的节点，我们要创建节点并插入视图中；如果找到了，就更新操作；如果找到旧子节点的位置和新子节点不同，则需要移动节点等。

+ 四种操作
  - 更新节点
  - 新增节点
  - 删除节点
  - 移动节点

```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b) // 当标签为input时，type必须是否相同
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) { // 新旧节点首尾四个指针
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 我们只能把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新 vnode 的 key 去找出在旧节点中可以复用的位置；
      // 拿新列表的第一个节点去旧列表中找与其key相同的节点。
      // 这个非理想的状态下的对比时间复杂度为 O(n^2):
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```

### 更新策略
1. 创建子节点

对于新增节点，我们需要执行创建节点的操作，并将新创建的节点插入到`oldChildren`中所有未处理节点的前面。

2. 更新子节点
3. 移动子节点

移动节点通常发生在`newChildren`中的某个节点和`oldChildren`中的某个节点是同一个节点，但是位置不同，所以在真实的`DOM`中需要将这个节点的位置以新虚拟节点的位置为基准进行移动。通过`Node.insertBefore()`方法移动节点，**移动的节点移动到所有未处理节点的最前面**。

4. 删除子节点

当`newChildren`中的所有节点都循环了一遍后，也就是循环结束后，如果`oldChildren`中还有剩余的没有被处理的节点，那么这些节点就是被废弃，需要删除的节点。

::: tip
`oldStartIdx`和`newStartIdx`只能向后移动，而`oldEndIdx`和`newEndIdx`只能向前移动。当开始位置大于等于结束位置时，说明所有节点都遍历过了，则结束循环。这个循环条件是无论`newChildren`或者`oldChildren`，只要它们两个中有一个循环完毕，就会退出循环。那么当新子节点和旧子节点节点数量不一致时，会导致循环结束后仍然有未处理的节点。不过这样也提升了性能。因为如果`oldChildren`先循环结束，这个时候如果`newChildren`中还有剩余的节点，说明这些是需要新增的，直接插入`DOM`中即可。反之则说明`oldChildren`没有被处理的节点需要删除掉。

在更新子节点时，需要在`oldChildren`中循环去找一个节点。但是如果我们在模板中渲染列表时，为子节点设置了属性`key`，就会生成一个`key`对应着一个节点下标这样一个对象。也就是说，如果在节点上设置了属性`key`。那么在`oldChildren`中找相同节点时，可以直接通过`key`拿到下标，从而获取节点。这样，我们根本不需要通过循环来查找节点。
- 首先，如果不加 `key` 的话，那么就不会去 `Map` 里匹配 `_(O(1))_`，而是循环遍历整个列表 `_(O(n))_`，肯定加 `key` 要快一点，性能更高
- 其次，如果不加 `key` 那么在插入或删除的时候就会出现，原本不是同一个节点的元素被认为是相同节点，上面也有说过是 `sameVnode` 函数判断的，因此可能会有额外 `DOM` 操作
:::