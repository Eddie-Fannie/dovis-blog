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

## 链表做题思维
1. 虚拟头结点，也就是`dummy`结点，如果不使用 `dummy` 虚拟节点，代码会复杂一些，需要额外处理指针 `p` 为空的情况。**而有了 `dummy` 节点这个占位符，可以避免处理空指针的情况，降低代码的复杂性**。
2. 同时需要新建一个变量把虚拟头结点赋值过去，用来返回结果链表
3. 同样需要把 `head` 原链表头结点赋值给一个新的变量，用来遍历循环链表节点
4. **`dummy`节点不参与赋值/遍历操作，只在最后需要读取值是使用`dummy.next`**

5. 链表倒数第`k`个节点。先让一个指针 `p1` 指向链表的头节点 `head`，然后走 `k` 步；现在的 `p1`，只要再走 `n - k` 步，就能走到链表末尾的空指针；趁这个时候，再用一个指针 `p2` 指向链表头节点 `head`；接下来就很显然了，让 `p1` 和 `p2` 同时向前走，`p1` 走到链表末尾的空指针时前进了 `n - k` 步，`p2` 也从 `head` 开始前进了 `n - k` 步，停留在第 `n - k + 1` 个节点上，即恰好停链表的倒数第 `k` 个节点上；**这样仅一次遍历链表**

```js
// 返回链表的倒数第 k 个节点
var findFromEnd = function(head, k) {
  var p1 = head;
  // p1 先走 k 步
  for (var i = 0; i < k; i++) {
    p1 = p1.next;
  }
  var p2 = head;
  // p1 和 p2 同时走 n - k 步
  while (p1 != null) {
    p2 = p2.next;
    p1 = p1.next;
  }
  // p2 现在指向第 n - k + 1 个节点，即倒数第 k 个节点
  return p2;
};
```

6. 如果想一次遍历就得到中间节点，也需要耍点小聪明，使用「快慢指针」的技巧：我们让两个指针 `slow` 和 `fast` 分别指向链表头结点 `head`。每当慢指针 `slow` 前进一步，快指针 `fast` 就前进两步，这样，当 `fast` 走到链表末尾时，`slow` 就指向了链表中点。**需要注意的是，如果链表长度为偶数，也就是说中点有两个的时候，我们这个解法返回的节点是靠后的那个节点。**

```js
/**
 * 快慢指针初始化指向 head
 * 快指针走到末尾时停止
 * 慢指针走一步，快指针走两步
 * 慢指针指向中点
 */
var middleNode = function(head) {
  var slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

7. 每当慢指针 `slow` 前进一步，快指针 `fast` 就前进两步。如果 `fast` 最终遇到空指针，说明链表中没有环；如果 `fast` 最终和 `slow` 相遇，那肯定是 `fast` 超过了 `slow` 一圈，说明链表中含有环。

```js
function hasCycle(head) {
  // 快慢指针初始化指向 head
  var slow = head, fast = head;
  // 快指针走到末尾时停止
  while (fast != null && fast.next != null) {
    // 慢指针走一步，快指针走两步
    slow = slow.next;
    fast = fast.next.next;
    // 快慢指针相遇，说明含有环
    if (slow == fast) {
      return true;
    }
  }
  // 不包含环
  return false;
}

// 如何找出环起点
var detectCycle = function(head) {
  var fast, slow;
  fast = slow = head;
  while (fast != null && fast.next != null) {
    fast = fast.next.next;
    slow = slow.next;
    if (fast == slow) break;
  }
  // 上面的代码类似 hasCycle 函数
  if (fast == null || fast.next == null) {
    // fast 遇到空指针说明没有环
    return null;
  }

  // 重新指向头结点
  slow = head;
  // 快慢指针同步前进，相交点就是环起点
  while (slow != fast) {
    fast = fast.next;
    slow = slow.next;
  }
  return slow;
};
```

8. 两个链表是否相交：我们可以让 `p1` 遍历完链表 `A` 之后开始遍历链表 `B`，让 `p2` 遍历完链表 `B` 之后开始遍历链表 `A`，这样相当于「逻辑上」两条链表接在了一起。如果这样进行拼接，就可以让 `p1` 和 `p2` 同时进入公共部分，也就是同时到达相交节点 `c1`

```js
/**
 * p1 points to the head node of A linked list, p2 points to the head node of B linked list.
 * p1 走一步，如果走到 A 链表末尾，转到 B 链表
 * p2 走一步，如果走到 B 链表末尾，转到 A 链表
 */
function getIntersectionNode(headA, headB) {
  var p1 = headA, p2 = headB;
  while (p1 != p2) {
    if (p1 == null) p1 = headB;
    else            p1 = p1.next;
    if (p2 == null) p2 = headA;
    else            p2 = p2.next;
  }
  return p1;
}
```

## 总结
遍历链表：链表的遍历操作可以通过一个指针从头节点开始遍历，一直到尾节点。在遍历的过程中，可以对节点进行增删改查等操作。

快慢指针：快慢指针是解决链表中许多问题的有效方法。它的思想是使用两个指针，一个指针每次移动一步，另一个指针每次移动两步。通过这种方法，可以找到链表的中间节点、判断链表是否有环等问题。

反转链表：它的思想是使用三个指针，分别指向当前节点、上一个节点和下一个节点。通过不断移动这三个指针，可以实现链表的反转操作。

合并链表：它的思想是使用一个新的链表，依次比较两个链表的节点值，将小的节点添加到新链表中。当其中一个链表为空时，将另一个链表的剩余节点添加到新链表中。

判断链表是否有环：可以使用快慢指针的方法，一个指针每次移动一步，另一个指针每次移动两步。如果存在环，则两个指针一定会相遇。

删除链表倒数第 `n` 个节点：可以使用快慢指针的方法，先让快指针移动 `n` 个节点，然后让慢指针和快指针同时移动，当快指针到达尾节点时，慢指针指向的就是倒数第 `n` 个节点。