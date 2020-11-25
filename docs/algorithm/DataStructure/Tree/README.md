# 树
1. 树中的每个元素都叫作节点，节点分为内部节点和外部节点。至少有一个子节点的节点称为内部节点。没有子元素的节点称为外部节点或叶节点。
2. 树的高度取决于所有节点深度的最大值。
3. 结点拥有的子树数称为结点的度。度为0的结点称为叶结点或终端结点。树的度是树内各结点的度的最大值。
4. 如果将树中结点的各子树看成从左至右是有次序的，不能互换的，则该树称为有序树，否则为无序树。
5. 对于树，使用同样的方式（也使用两个指针），但是一个指向左侧子节点，另一个指向右侧子节点。

## 二叉树
1. 二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。
2. 二叉搜索树（`BST`）是二叉树的一种，但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值。
3. 二叉树具有五种基本形态：
- 空二叉树
- 只有一个根结点
- 根结点只有左子树
- 根结点只有右子树
- 根结点既有左子树也有右子树。
4. 在一棵二叉树中，如果所有分支结点都存在左子树和右子树，并且所有叶子都在同一层上，这样的二叉树称为满二叉树。

## 二叉树的性质
1. 在二叉树的第`i`层上至多有`2^(i-1)`个结点
2. 深度为`k`的二叉树至多有`2^k-1`个结点
3. 对任何一棵二叉树`T`，如果其终端结点数为`n0`，度为2的结点为`n2`，则`n0=n2+1`
4. 具有n个结点的完全二叉树的深度为`[log2(n)]+1`([x]表示不大于x的最大整数)
5. 如果对一棵有`n`个结点的完全二叉树的结点按层序编号，对任一结点i有：
- 如果`i=1`，则结点i是二叉树的根，无双亲；如果`i>1`，则其双亲是结点`[i/2]`
- 如果`2i>n`，则结点i无左孩子(结点i为叶子结点)；否则其左孩子是结点`2i`
- 如果`2i+1>n`，则结点i无右孩子，否则则其右孩子是结点`2i+1`

二叉树每个结点最多有两个孩子，所以为它设计一个数据域和两个指针域，我们叫做链表为二叉链表。

## 树的遍历
前序遍历：前序遍历首先访问根节点，然后遍历左子树，最后遍历右子树。
中序遍历：先遍历左子树，然后访问根节点，然后遍历右子树。
后序遍历：先遍历左子树，然后遍历右子树，最后访问树的根节点。(当你删除一个节点时，你将首先删除它的左节点和它的右边的节点，然后再删除节点本身。**后序遍历的应用**)

三种遍历都可以用递归实现：

前序遍历：
> 给定一个二叉树，返回它的前序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const res = []
    function traversal(root) {
        if(root) {
            res.push(root.val) // 先访问根结点的值
            traversal(root.left) // 再递归遍历左子树
            traversal(root.right) // 最后递归遍历右子树
        }
    }
    traversal(root)
    return res
};

var preorderTraversal = function(root, arr=[]) {
    if(root) {
        arr.push(root.val)
        preorderTraversal(root.left,arr)
        preorderTraversal(root.right, arr)
    }
    return arr
};

```
用非递归的方法实现前序遍历：
- 取根节点为目标节点，开始遍历；
- 访问目标节点
- 左孩子入栈--> 直至左孩子为空的节点
- 节点出栈，以右孩子为目标节点，再依次执行1，2，3
```js
var preorderTraversal = function (root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
        while (current) {
            result.push(current.val);
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        current = current.right;
    }
    return result;
};
```

**中序遍历**
```js
var inorderTraversal = function(root) {
    const res = []
    function traversal(root) {
        if(root) {
            traversal(root.left) // 先递归遍历左子树
            res.push(root.val) // 再访问根结点的值
            traversal(root.right) // 最后递归遍历右子树
        }
    }
    traversal(root)
    return res
};
```
非递归方式实现中序遍历：
- 取跟节点为目标节点，开始遍历
- 左孩子入栈 -> 直至左孩子为空的节点
- 节点出栈 -> 访问该节点
- 以右孩子为目标节点，再依次执行1、2、3

```js
var inorderTraversal = function (root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        result.push(current.val);
        current = current.right;
    }
    return result;
};
```

**后序遍历**
```js
var preorderTraversal = function(root) {
    const res = []
    function traversal(root) {
        if(root) {
            traversal(root.left) // 先递归遍历左子树
            traversal(root.right) // 再递归遍历右子树
            res.push(root.val) // 最后访问根结点的值
            
        }
    }
    traversal(root)
    return res
};
```

## 递归二叉树的秘笈
> 写树相关的算法，简单说就是，先搞清楚当前 `root` 节点该做什么，然后根据函数定义递归调用子节点，递归调用会让孩子节点做相同的事情。

深度遍历模板：
- N叉树
```js
function dfs(root) {
 if (满足特定条件）{
  // 返回结果 or 退出搜索空间
 }
 for (const child of root.children) {
        dfs(child)
 }
}

```
- 二叉树
```js
function dfs(root) {
 if (满足特定条件）{
  // 返回结果 or 退出搜索空间
 }
    dfs(root.left)
    dfs(root.right)
}
```
- 前序遍历
```js
function dfs(root) {
 if (满足特定条件）{
  // 返回结果 or 退出搜索空间
    }
    // 主要逻辑
    dfs(root.left)
    dfs(root.right)
}
```
- 后序遍历
```js
function dfs(root) {
 if (满足特定条件）{
  // 返回结果 or 退出搜索空间
    }
    dfs(root.left)
    dfs(root.right)
    // 主要逻辑
}
```

广度遍历模板
- 标记层：
```python
class Solution:
    def bfs(k):
        # 使用双端队列，而不是数组。因为数组从头部删除元素的时间复杂度为 N，双端队列的底层实现其实是链表。
        queue = collections.deque([root])
        # 记录层数
        steps = 0
        # 需要返回的节点
        ans = []
        # 队列不空，生命不止！
        while queue:
            size = len(queue)
            # 遍历当前层的所有节点
            for _ in range(size):
                node = queue.popleft()
                if (step == k) ans.append(node)
                if node.right:
                    queue.append(node.right)
                if node.left:
                    queue.append(node.left)
            # 遍历完当前层所有的节点后 steps + 1
            steps += 1
        return ans
```

- 不标记层
```python
class Solution:
    def bfs(k):
        # 使用双端队列，而不是数组。因为数组从头部删除元素的时间复杂度为 N，双端队列的底层实现其实是链表。
        queue = collections.deque([root])
        # 队列不空，生命不止！
        while queue:
            node = queue.popleft()
            # 由于没有记录 steps，因此我们肯定是不需要根据层的信息去判断的。否则就用带层的模板了。
            if (node 是我们要找到的) return node
            if node.right:
                queue.append(node.right)
            if node.left:
                queue.append(node.left)
        return -1
```