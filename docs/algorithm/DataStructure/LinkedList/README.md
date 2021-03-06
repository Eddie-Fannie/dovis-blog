# 链表
> 链表中的元素在内存中并不是连续放置的。每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也称指针或链接）组成。在数组中，我们可以**直接访问任何位置的任何元素，而要想访问链表中间的一个元素，则需要从起点（表头）开始迭代链表直到找到所需的元素。**

把存储数据元素信息的域称为数据域，把存储直接后继位置的域称为指针域。指针域中存储的信息称作指针或链。这两部分信息组成数据元素`ai(下标)`的存储映像，称为结点(`Node`)。链表最后一个结点指针指向空`Null`

为了更加方便对链表进行操作，会在单链表的第一个结点前附设一个结点，称为头结点。**若线性表为空表，则头结点的指针域为空**
```bash
node = value + next(指向下一个元素的引用)

p->data = ai(数据域), p->next->data = ai+1
```

**头指针是指链表指向第一个结点的指针，若链表有头结点，则是指向头结点的指针。头指针的链表的必要元素。整个链表的存取必须从头指针开始进行。头结点是为了操作的统一和方便而设立的，放在第一个元素的结点之前，其数据域一般无意义。**

1. 循环列表时可以拿头结点来参照，如：`head = head.next`
2. 链表插入
![img](/dovis-blog/other/14.jpg)

```bash
s->next = p->next p->next=s;
```

3. 链表删除
```js
p->next = p->next->next
```
4. 若线性表为空表，则头结点的指针域为空。

::: tip
访问数据时我们需要从链表头部开始查找，如果目标数据在最后，就需要`O(n)`。添加/删除都是`O(1)`
:::

## 创建链表
- 数据结构为动态，需要将第一个元素引用保存下来`head`。
- 声明一个属性用来存储链表的元素数量`count`
- 要表示链表中的第一个以及其他元素，我们需要一个助手类，叫作`Node`。`Node`类表示我们想要添加到链表中的项。它包含一个`element`属性，该属性表示要加入链表元素的值；以及一个`next`属性，该属性是指向链表中下一个元素的指针。

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

## 移除元素
```js
removeAt(index) {
    
}
```

## 实现单向链表
```js
class Node {
  constructor(v, next) {
    this.value = v
    this.next = next
  }
}
class LinkList {
  constructor() {
    // 链表长度
    this.size = 0
    // 虚拟头部
    this.dummyNode = new Node(null, null)
  }
  find(header, index, currentIndex) {
    if (index === currentIndex) return header
    return this.find(header.next, index, currentIndex + 1)
  }
  addNode(v, index) {
    this.checkIndex(index)
    // 当往链表末尾插入时，prev.next 为空
    // 其他情况时，因为要插入节点，所以插入的节点
    // 的 next 应该是 prev.next
    // 然后设置 prev.next 为插入的节点
    let prev = this.find(this.dummyNode, index, 0)
    prev.next = new Node(v, prev.next)
    this.size++
    return prev.next
  }
  insertNode(v, index) {
    return this.addNode(v, index)
  }
  addToFirst(v) {
    return this.addNode(v, 0)
  }
  addToLast(v) {
    return this.addNode(v, this.size)
  }
  removeNode(index, isLast) {
    this.checkIndex(index)
    index = isLast ? index - 1 : index
    let prev = this.find(this.dummyNode, index, 0)
    let node = prev.next
    prev.next = node.next
    node.next = null
    this.size--
    return node
  }
  removeFirstNode() {
    return this.removeNode(0)
  }
  removeLastNode() {
    return this.removeNode(this.size, true)
  }
  checkIndex(index) {
    if (index < 0 || index > this.size) throw Error('Index error')
  }
  getNode(index) {
    this.checkIndex(index)
    if (this.isEmpty()) return
    return this.find(this.dummyNode, index, 0).next
  }
  isEmpty() {
    return this.size === 0
  }
  getSize() {
    return this.size
  }
}
```

::: tip
由于不必须按顺序存储，链表在插入的时候可以达到 `O(1)` 的复杂度，比另一种线性表 —— 顺序表快得多，但是查找一个节点或者访问特定编号的节点则需要 `O(n)` 的时间，而顺序表相应的时间复杂度分别是 `O(log n)` 和 `O(1)`。
:::