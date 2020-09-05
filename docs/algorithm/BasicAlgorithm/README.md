# 哈希表
哈希表存储的是由键`key`和值`value`组成的数据。

# 二分查找
查找已经排序好的数据。通过比较数组中间的数据和目标数据的大小，可以得知目标数据是在数组的左边还是右边。**数据量为n的数组，将其长度减半`log2^n`次后。可以得知时间复杂度为`O(logn)`**

1. > 在 `[1, 2, 3, 4, 5, 6, 7, 8, 9]` 中找到 `4`，若存在则返回下标，不存在返回`-1`，要求算法复杂度`O(logn)`
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

## 线性查找
时间复杂度为`O(n)`