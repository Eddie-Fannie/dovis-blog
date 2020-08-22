# 剑指 Offer 22. 链表中倒数第k个节点
输入一个链表，输出该链表中倒数第k个节点。

## 示例
```bash
给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.
```

## 解答
快慢指针
1. `p`,`q`两个指针，让`p`先走`k`步，然后`p`,`q`一起走，直到`p`为`null`
```js
var getKthFromEnd = function(head, k) {
    let p=head, q=head, i=0
    while(p) {
        if(i>=k) {
            q = q.next
        }
        p = p.next
        i++
    }
    return i<k ? null : q;
};
```

栈方法
```js
var getKthFromEnd = function(head, k) {
    //栈方法
    var stack = []
    var ans = []
    //所有节点入栈
    while(head){
        stack.push(head)
        head = head.next
    }
    //出栈第k个节点
    while(k > 0){
        ans = stack.pop()
        k--
    }
    return ans
};
```