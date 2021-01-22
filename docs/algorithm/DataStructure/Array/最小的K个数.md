# 剑指offer40. 最小的k个数
输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入`4、5、1、6、2、7、3、8`这`8`个数字，则最小的`4`个数字是`1、2、3、4`。

```bash
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]

输入：arr = [0,1,2,1], k = 1
输出：[0]
```

## 解答
- 自己的答案
```js
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function(arr, k) {
    let result = arr.slice(0,k)
    let restArr = arr.slice(k)
    let restMax = Math.max(...result)
    let maxIndex = 0
    for(let num of restArr) {
        if(num < restMax) {
            maxIndex = result.indexOf(restMax)
            result.splice(maxIndex,1,num)
            restMax = Math.max(...result) 
        }
    }
    return result
};
```

- 排序
```js
// ac地址：https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/
// 原文地址：https://xxoo521.com/2020-02-21-least-nums/

/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function(arr, k) {
    return arr.sort((a, b) => a - b).slice(0, k);
};
```