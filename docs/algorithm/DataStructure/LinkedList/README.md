# 链表
> 链表中的元素在内存中并不是连续放置的。每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也称指针或链接）组成。在数组中，我们可以**直接访问任何位置的任何元素，而要想访问链表中间的一个元素，则需要从起点（表头）开始迭代链表直到找到所需的元素。**

```bash
node = value + next(指向下一个元素的引用)
```

::: tip
访问数据时我们需要从链表头部开始查找，如果目标数据在最后，就需要`O(n)`。添加/删除都是`O(1)`
:::
## 创建链表
- 数据结构为动态，需要将第一个元素引用保存下来`head`。
- 声明一个属性用来存储链表的元素数量`count`
- 要表示链表中的第一个以及其他元素，我们需要一个助手类，叫作`Node`。Node类表示我们想要添加到链表中的项。它包含一个`element`属性，该属性表示要加入链表元素的值；以及一个`next`属性，该属性是指向链表中下一个元素的指针。

```js
export class Node {
    constructor(element) {
        this.element = element;
        this.next = undefined;
    }
}
```
## 向链表尾部添加元素
> 链表为空，添加的是第一个元素；链表不为空，向其追加元素。
```js
push(element) {
    const node = new Node(element)
    let current;
    if(this.head == null) {
        this.head = node;
    } else {
        current = this.head;
        while(current.next != null) {
            current = current.next;
        }
        current.next = node
    }
    this.count++
}
```
> 向空列表添加一个元素。当我们创建一个`LinkedList`对象时，`head`会指向`undefined`（或者是`null`）。链表最后一个节点的下一个元素始终是`undefined`或`null`。

> 要向链表的尾部添加一个元素，首先需要找到最后一个元素。记住，我们只有第一个元素的引用，因此需要循环访问列表，直到找到最后一项。为此，我们需要一个指向链表中`current`项的变量。在循环访问链表的过程中，当`current.next`元素为`undefined`或`null`时，我们就知道已经到达链表尾部了。然后要做的就是让当前（也就是最后一个）元素的`next`指针指向想要添加到链表的节点