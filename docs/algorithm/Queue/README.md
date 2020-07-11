# 队列
先进先出`FIFO`
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
    // 检查队列是否为空并获取长度
    isEmpty() {
        return this.count - this.lowestCount === 0;
    }
    // 清空队列
    clear() {
        this.items = {}
        this.count = 0;
        this.lowestCount = 0;
    }
    // 创建toString方法
    toString() {
        if(this.isEmpty()) {
            return ''
        }
        let objString = `${this.items[this.lowestCount}`;
        for(let i = this.lowestCount+1;i<this.count;i++) { // 队列类不一定第一个索引值为0
            objString = `${objString}, ${this.items[i]}`;
        }
        return objString;
    }
}
```
## 双端队列
> `deque`是一种允许我们同时从前端和后端添加和移除元素的特殊队列。**由于双端队列同时遵守了先进先出和后进先出原则，可以说它是把队列和栈相结合的一种数据结构。**

### 创建`Deque`类
```js
class Deque{
    constructor() {
        this.count = 0;
        this.lowestCount = 0;
        this.items = {}
    }
    // 向双端队列前端添加元素
    addFront(element) {
        if(this.isEmpty()) {
            this.addBack(element);
        } else if(this.lowestCount > 0) {
            this.lowestCount--;
            this.items[this.lowestCount] = element;
        } else {
            for(let i = this.count; i> 0;i--) {
                this.items[i] = this.items[i-1] // 将所有元素往后移空出位置来放队头元素。
            }
            this.count++;
            this.lowestCount = 0;
            this.items[0] = element
        }
    }
}
```
**`addFront()`**
> 第一种场景是这个双端队列是空的。在这种情况下，我们可以执行`addBack`方法。元素会被添加到双端队列的后端，在本例中也是双端队列的前端。`addBack`方法已经有了增加`count`属性值的逻辑，因此我们可以复用它来避免重复编写代码。第二种场景是一个元素已经被从双端队列的前端移除，也就是说`lowestCount`属性会大于等于1。这种情况下，我们只需要将`lowestCount`属性减1并将新元素的值放在这个键的位置上即可。第三种也是最后一种场景是lowestCount为0的情况。

> `addBack(element)`和普通队列的添加新元素一致；其余方法在普通队列和栈的基础知识点中都有提及。


## 循环队列
> 可以使用固定大小的数组和两个指针来指示起始和结束位置。目的是重用浪费的存储。

```js
class MyCircularQueue {
    constructor(k) {
        this.list = Array(k) // 创建一个长度为k的空数组
        this.front = 0  // 保存头部指针位置
        this.real = 0   // 保存尾部指针位置
        this.max = k    // 保存该数组最大长度，也就是k 
    }
    Front() {
        if (this.isEmpty()) {
            return -1
        }
        return this.list[this.front]
    }
    Rear() {
        if (this.isEmpty()) {
            return -1
        }
        let val = this.real - 1 >= 0 ? this.real - 1 : this.max - 1  
        return this.list[val]
    }
    enQueue(value) {
        if (!this.isFull()) {
            this.list[this.real] = value
            this.real = (this.real + 1) % this.max
            return true
        } else {
            return false
        }
    }
    deQueue() {
        if (!this.isEmpty()) {
            this.list[this.front] = ''
            this.front = (this.front + 1) % this.max
            return true
        } else {
            return false
        }
    }
    isEmpty() {
        if (this.real === this.front && !this.list[this.front]) {
            return true
        } else {
            return false
        }
    }
    isFull() {
        if (this.real === this.front && !!this.list[this.front]) {
            return true
        } else {
            return false
        }
    }
}
```

击鼓传花游戏模拟循环队列
```js
function hotPotato(elementList, num) {
    const queue = new Queue();
    const elimitatedList = [] // 淘汰名单

    for(let i =0;i<elementList.length;i++) {
        queue.enqueue(elementsList[i])
    }
    while(queue.size() >1) {
        for(let i=0;i<num;i++) {
            queue.enqueue(queue.dequeue())
        }
        elimitatedList.push(queue.dequeue()) 
    }
    return {
        eliminated: elimitatedList,
        winner: queue.dequeue()
    }
}
```