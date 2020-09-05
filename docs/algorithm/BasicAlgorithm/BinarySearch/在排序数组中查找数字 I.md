# 剑指 Offer 53 - I. 在排序数组中查找数字 I
> 统计一个数字在排序数组中出现的次数

示例1:
```bash
输入：nums=[5,7,78,8,10],target=8
输出：2
```

## 思路
利用二分查找，利用`start,end`两个指针来找出所需要查找数字的左右边界，差就是出现的次数。
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let low = 0
    let high = nums.length-1
    let start = -1
    let end = -1
    // 找左边界
    while(low<=high) {
        let mid = (low + high) >>> 1
        if(nums[mid] === target) {
            start = mid
            high = mid-1
        }
        if(nums[mid] < target) {
            low = mid+1
        } else {
            high = mid -1
        }
    }
    // 找右边界
    low = 0
    high = nums.length-1
    while(low<=high) {
        let mid = (low + high) >>> 1
        if(nums[mid] === target) {
            end=mid
            low = mid+1
        } else if(nums[mid] > target) {
            high = mid-1
        } else {
            low = mid +1
        }
    }
    return start<=end&&start !== -1 ? end-start+1 : 0
};
```

## 类似题
34. 在排序数组中查找元素的第一个和最后一个位置
> 给定一个按照升序排列的整数数组 `nums`，和一个目标值 `target`。找出给定目标值在数组中的开始位置和结束位置。你的算法时间复杂度必须是 `O(log n)` 级别。如果数组中不存在目标值，返回 `[-1, -1]`。

```bash
输入： nums=[5,7,7,8,8,10], target=8
输出： [3,4]
```

```js
// 自己的答案
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    function findStart() {
        let low = 0, high = nums.length -1,start=-1
        while(low<=high) {
            let mid = (low + high) >>> 1
            if(nums[mid] === target) {
                start = mid
                high = mid -1
            }
            if(nums[mid] < target) {
                low = mid+1
            } 
            if(nums[mid] > target) {
                high = mid -1
            }
        }
        return start
    }
    function findEnd() {
        let low = 0, high = nums.length -1,end=-1
        while(low<=high) {
            let mid = (low + high) >>> 1
            if(nums[mid] === target) {
                end = mid
                low = mid+1
            }
            if(nums[mid] < target) {
                low = mid+1
            } 
            if(nums[mid] > target) {
                high = mid -1
            }
        }
        return end
    }
    if(findEnd() === -1&&findStart() !== -1) {
        return [findStart()]
    } else {
        return [findStart(), findEnd()]
    }
};
```

> 可以通过查找目标值`target`的右边界`midR`，又因为是有序数组，所以通过查找`target-1`的值的右边界。
例如`[5,7,7,8,8,10]`找到第一个目标值的右边界为`4`，然后查找`target-1`值的右边界为`2`，就可以得知结果为`[2+1,4]`即为`[3,4]`

```js
// 查找的是右边界
var searchRange = function (nums, target) {
    let mid, midL, midR;
    // 搜索右边界
    function searchR(left, right, target) {
        while (left <= right) {
            mid = (left + right) >> 1;
            if (nums[mid] <= target) left = mid + 1;
            else right = mid - 1;
        }
        return right
    }
    // 在区间[0, nums.length - 1]搜索target的右边界midR
    midR = searchR(0, nums.length - 1, target)
    // midR < 0说明超过边界；nums[midR] !== target说明无此元素；
    if (midR < 0 || nums[midR] !== target) return [-1, -1]
    // 在区间[0, midR - 1]搜索target - 1的右边界midL
    midL = searchR(0, midR - 1, target - 1)
    return [midL + 1, midR]
};

// 另一种方式查找左边界
var searchRange = function (nums, target) {
    let mid, midL, midR;
    function searchL(left, right, target) {
        while (left <= right) {
            mid = (left + right) >> 1;
            if (nums[mid] >= target) right = mid - 1;
            else left = mid + 1;
        }
        return left
    }
    midL = searchL(0, nums.length - 1, target)
    if (midL >= nums.length || nums[midL] !== target) return [-1, -1]
    midR = searchL(midL + 1, nums.length - 1, target + 1)
    return [midL, midR - 1]
};
```
