# 哈希表
哈希表存储的是由键`key`和值`value`组成的数据。

# 二分查找
查找已经排序好的数据。通过比较数组中间的数据和目标数据的大小，可以得知目标数据是在数组的左边还是右边。**数据量为n的数组，将其长度减半`log2^n`次后。可以得知时间复杂度为`O(logn)`**

> 在 `[1, 2, 3, 4, 5, 6, 7, 8, 9]` 中找到 `4`，若存在则返回下标，不存在返回`-1`，要求算法复杂度`O(logn)`

![img](/dovis-blog/other/42.png)

```js
function searchNum (target, nums) {
  if (!nums.length) return -1
  let left = 0
  let right = nums.length - 1
  let mid
  while (left <= right) {
      mid = (left + right) >>> 1 // 位运算除以2，速度更快
      if (nums[mid] === target) {
          return mid
      }
      if (nums[mid] < target) {
          left = mid + 1
      }
      if (nums[mid] > target) {
          right = mid - 1
      }
  }
  return -1
}
```
看出二分法的基础模板：
```js
let low = start
let high = end
let mid
while(low < high) {
    mid = (left + right) >>> 1 //相当于除以2
    if(array[mid] === target) {
        return result
    }
    if(array[mid] < target) {
        left = mid +1
    }
    if(array[mid] > target) {
        right = mid -1
    }
}
```

# 线性查找
时间复杂度为`O(n)`

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

> 传统冒泡排序中每一遍只能找到一个最大值或最小值。我们考虑利用在每一趟排序中进行正向和反向两遍冒泡，一次可以得到最大值和最小值，排序趟数减少

![img](/dovis-blog/other/31.jpg)

## 选择排序
重复从待排序的数据中寻找最小值，将其与序列最左边的数字进行交换。序列中寻找最小值使用线性查找。时间复杂度和冒泡排序一样。
```js
function selectSort(arr) {
    //缓存数组长度
    const len = arr.length
    //定义minIndex，缓存当前区间最小值的索引，注意是索引
    let minIndex
    //遍历数组中的前n-1个元素
    for(let i=0;i<len-1;i++) {
        // 初始化minIndex为当前区间第一个元素
        minIndex = i
        // i,j分别定义当前区间的上下界，i是左边界，j是右边界
        for(let j=i;j<len;j++) {
            // 若j处的数据项比当前最小值还要小，则更新最小值索引为j
            if(arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        // 如果minIndex发生过更新，则将minIndex置于当前排序区间头部
        if(minIndex !== i) {
            [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]]
        }
    }
    return arr
}
```

## 插入排序

## 快速排序
> 快速排序算法首先会在序列中随机选择一个基准值（`pivot`），然后将除了基准值以外的数分为“比基准值小的数”和“比基准值大的数”这两个类别，再将其排列成以下形式。

::: tip
快速排序是一种“分治法”。它将原本的问题分成两个子问题（比基准值小的数和比基准值大的数），然后再分别解决这两个问题。子问题，也就是子序列完成排序后，再像一开始说明的那样，把他们合并成一个序列，那么对原始序列的排序也就完成了。不过，解决子问题的时候会再次使用快速排序，甚至在这个快速排序里仍然要使用快速排序。只有在子问题里只剩一个数字的时候，排序才算完成。像这样，在算法内部继续使用该算法的现象被称为“递归”。
:::

- 分割子序列时需要选择基准值，如果每次选择的基准值都能使得两个子序列的长度为原本的一半，那么快速排序的运行时间和归并排序的一样，都为`O（nlogn）`。
- 如果运气不好，每次都选择最小值作为基准值，那么每次都需要把其他数据移到基准值的右边，递归执行`n`行，运行时间也就成了`O（n^2）`。

```js
// 快速排序入口 
function quickSort(arr, left = 0, right = arr.length - 1) { 
    // 定义递归边界，若数组只有一个元素，则没有排序必要 
    if(arr.length > 1) { 
        // lineIndex表示下一次划分左右子数组的索引位 
        const lineIndex = partition(arr, left, right) 
        // 如果左边子数组的长度不小于1，则递归快排这个子数组 
        if(left < lineIndex-1) { 
            // 左子数组以 lineIndex-1 为右边界 
            quickSort(arr, left, lineIndex-1) 
        } 
        // 如果右边子数组的长度不小于1，则递归快排这个子数组 
        if(lineIndex<right) { 
            // 右子数组以 lineIndex 为左边界
            quickSort(arr, lineIndex, right) 
        } 
    } 
return arr } 

// 以基准值为轴心，划分左右子数组的过程 
function partition(arr, left, right) { 
    // 基准值默认取中间位置的元素 
    let pivotValue = arr[Math.floor(left + (right-left)/2)] 
    // 初始化左右指针 
    let i = left let j = right 
    // 当左右指针不越界时，循环执行以下逻辑 
    while(i<=j) { 
        // 左指针所指元素若小于基准值，则右移左指针 
        while(arr[i] < pivotValue) { i++ } 
        // 右指针所指元素大于基准值，则左移右指针 
        while(arr[j] > pivotValue) { j-- } 
        // 若i<=j，则意味着基准值左边存在较大元素或右边存在较小元素，交换两个元素确保左右两侧有序 
        if(i<=j) { swap(arr, i, j) i++ j-- } 
    } 
    // 返回左指针索引作为下一次划分左右子数组的依据 
    return i 
} 
// 快速排序中使用 swap 的地方比较多，我们提取成一个独立的函数 
function swap(arr, i, j) { 
    [arr[i], arr[j]] = [arr[j], arr[i]] 
}
```

> 学习了侯策《前端进阶》一书

```js
function quickSort(arr) {
    if(arr.length < 2) return arr
    let pivot = arr[Math.floor(Math.random() * arr.length)] // 找到基准值
    let left = [],mid = [],right=[]
    for(let num of arr) {
        let value = num
        if(value > pivot) {
            right.push(value)
        } else if(value < pivot) {
            left.push(value)
        } else {
            mid.push(value)
        }
    }
    return quickSort(left).concat(mid,quickSort(right))
}
```

![img](/dovis-blog/other/30.jpg)