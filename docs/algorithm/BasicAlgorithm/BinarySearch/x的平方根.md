# 69.x的平方根

## 题目
实现 int sqrt(int x) 函数。

计算并返回 x 的平方根，其中 x 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

## 示例
```bash
输入：4，
输出：2

输入：8
输出：2
8的平方根是2.82842...由于返回类型为整数，小数部分将被舍去。
```

## 解答
二分法：
```js
var mySqrt = function(x) {
    if(x<2) return x;
    let low = 1,mid,high=Math.floor(x/2)
    while(low<=high) {
        mid= (low + high) >>> 1
        if(mid*mid === x) {
            return mid
        }
        if(mid*mid < x) {
            low = mid +1
        } else {
            high = mid -1
        }
    }
    return high
};
```