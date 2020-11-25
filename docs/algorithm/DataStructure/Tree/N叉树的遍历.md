# 590. N叉树的后序遍历
> 给定一个N叉树，返回其节点值的后序遍历

![img](/dovis-blog/other/60.png)

## 589. N叉树的前序遍历
![img](/dovis-blog/other/61.png)
```js
var preorder = function(root) {
  const res = []
  function traversal (root) {
    if (root !== null) {
      res.push(root.val)
      root.children.forEach(child => traversal(child))
    }
  }
  traversal(root)
  return res
}
```