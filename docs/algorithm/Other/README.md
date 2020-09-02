# 复杂度
## 时间复杂度
推导大O阶：
1. 用常数1取代运行时间所有加法常数
2. 在修改后的运行次数函数中，只保留最高阶项
3. 如果最高阶项存在且不是1，则去除这个项相乘的常数
得到的就是大O阶

```js
int count = 1;
while(count < n) {
    count = count * 2
}
```
由于每次`count`乘以`2`之后，距离n更近一步。也就是说有多少个`2`相乘后大于`n`就会退出循环。也就是`2^x = n`得到`x=log2(n)`。所以时间复杂度为`O(logn)`

## 空间复杂度
1. 如果算法执行所需要的临时空间不随着某个变量`n`的大小而变化，即此算法空间复杂度为一个常量，可表示为 `O(1)`

# 排序
## 冒泡排序
比较两个相邻数字大小，然后交换位置。这样第一轮比较`n-1`次，第二轮则为`n-2`次逐渐比较完成，时间复杂度为`O(n^2)`
```js
let arr = [1,2,4,5,3,9,10,11]
function bubbleSort(arr) {
    for(let i=0;i<arr.length;i++) {
        for(let j=0;j<arr.length - i-1;j++) {
            if(arr[j] >arr[j+1]) {
                [arr[j],arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
    return arr
}
```
+ 优化：
    - 当循环没有冒泡立即停止循环
```js
function bubbleSort(array) {
    for (let j = 0; j < array.length; j++) {
        let complete = true;
        for (let i = 0; i < array.length - 1 - j; i++) {
            // 比较相邻数
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                complete = false;
            }
        }
        // 没有冒泡结束循环
        if (complete) {
            break;
        }
    }
    return array;
}
```

## 选择排序
重复从待排序的数据中寻找最小值，将其与序列最左边的数字进行交换。序列中寻找最小值使用线性查找。时间复杂度和冒泡排序一样。