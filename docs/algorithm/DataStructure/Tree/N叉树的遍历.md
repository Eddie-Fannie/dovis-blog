# 590. N叉树的后序遍历
> 给定一个N叉树，返回其节点值的后序遍历

![img](/dovis-blog/other/60.png)

## 589. N叉树的前序遍历
![img](/dovis-blog/other/61.png)

- 前序遍历递归解法
```js
/**
 * @param {Node} root
 * @return {number[]}
 */
var preorder = function(root) {
  let array = []
  var dfs = function (node) {
    if (node === null) {
      return
    }
    array.push(node.val)
    for (let i = 0; i < node.children.length; i++) {
      dfs(node.children[i])
    }
    return
  }
  dfs(root)
  return array
};
```

- 利用栈，其实我这里是用层序遍历的思想，然后通过改变当前遍历节点的子节点 `children` 的插入位置来实现的
```js
/**解法二
 * @param {Node} root
 * @return {number[]}
 */
var preorder = function(root) {
  if (root === null) {
    return []
  }
  let array = []
  let stack = [root]
  while (stack.length) {
    let len = stack.length
    let node = stack.shift() // 弹出栈中第一个，先进先出
    array.push(node.val)
    if (node.children.length > 0) {
      stack = node.children.concat(stack) // 这里有别于层序遍历，用 node.children 连接 stack，而不是 stack.concat(node.children)这样就实现了前序遍历的效果

      //相当于
      // for(var i = node.children.length - 1; i >= 0; i--){
      //       arr.push(node.children[i]);
      //   }

    }
  }
  return array
};
```