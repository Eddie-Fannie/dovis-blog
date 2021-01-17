# 删除链表的倒数第N个节点
给定一个链表，删除链表的倒数第`n`个节点，并且返回链表的头结点

```bash
给定一个链表：1->2->3->4->5 和n=2
当删除倒数第二个节点后，链表变为1->2->3->5
```

## 思路
快指针`fast`先前进`n`，找到需要删除的节点；然后慢指针`slow`从`head`开始，和快指针`fast`一起前进，直到`fast`走到末尾。此时`slow`的下一个节点就是要删除的节点。

- 要注意如果快指针走`n`个节点后到了末尾，那就是说明头节点是要删除的

## 解答
- 双指针
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    if(head === null || n === 0) return head
    let fast = head,slow = head
    while(n > 0) {
        fast = fast.next
        n--
    }
    // 快指针移动n步之后已经到尾部，说明要删除的是头部节点
    if(fast === null) {
        return head.next
    }
    while(fast.next !== null) {
        fast = fast.next
        slow = slow.next
    }
    slow.next = slow.next.next
    return head
};
```