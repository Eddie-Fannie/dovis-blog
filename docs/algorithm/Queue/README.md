# 队列

## 普通队列
### 创建队列
```js
class Queue {
    constructor() {
        this.count = 0; // 队列大小
        this.lowestCount = 0; // 队头
        this.items = {} // 存储元素
    }
    // 队列尾部添加项
    enqueue(value) {
        this.items[this.count] = value;
        this.count++;
    }
    // 队列移除元素 头部移除
    dequeue() {
        if(this.isEmpty()) {
            return
        }
        const result = this.items[this.lowestCount]; // 队头项
        delete result // 删除
        this.lowestCount++ // 队头加一
        return result; // 返回被删除项
    }
    // 查看队头元素
    peek() {
        if(this.isEmpty()) {
            return
        }
        return this.items[this.lowestCount]
    }
}
```

## 循环队列
> 可以使用固定大小的数组和两个指针来指示起始和结束位置。目的是重用浪费的存储。