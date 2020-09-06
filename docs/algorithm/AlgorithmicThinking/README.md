# 算法设计与技巧
## 动态规划
> 动态规划（`dynamic programming, DP`）是一种将复杂问题分解成更小的子问题来解决的优化技术

::: tip
动态规划和分而治之是不同的方法。分而治之方法是把问题分解成相互独立的子问题，然后组合它们的答案，而动态规划则是将问题分解成相互依赖的子问题。

斐波那契数列问题也是动态规划的一个例子，分解成一些小问题来解决。
:::

用动态规划解决问题时，遵循三个重要步骤：
- 定义子问题；
- 实现要反复执行来解决子问题的部分（递归）
- 识别并求解出边界条件。

### 最少硬币找零问题
>例如，美国有以下面额（硬币）:`d1= 1, d2= 5, d3= 10, d4= 25`。如果要找`36`美分的零钱，我们可以用1个`25`美分、1个`10`美分和1个便士（1美分）。

```js
function minCoinChange(coins, amount) {
    const cache = []; // {1} 记忆法，缓存
    const makeChange = (value) => { // {2} 递归函数
        if (!value) { // {3}
            return [];
        }
        if (cache[value]) { // {4}
            return cache[value];
        }
        let min = [];
        let newMin;
        let newAmount;
        for (let i = 0; i<coins.length; i++) { // {5} coins每种面额组成的数组
            const coin = coins[i];
            newAmount = value - coin; // {6}
            if (newAmount >= 0) {
                newMin = makeChange(newAmount); // {7}
            }
            if (
                newAmount >= 0 && // {8}
                (newMin.length < min.length -1 || ! min.length) && // {9}
                (newMin.length || ! newAmount) // {10}
            ) {
                min = [coin].concat(newMin); // {11}
                console.log('new Min ' + min + ' for ' + amount);
            }
        }
        return (cache[value] = min); // {12}
    };
    return makeChange(amount); // {13}
}
```

## 递归
能动态规划的都可以使用递归
[著名递归例子](/algorithm/AlgorithmicThinking/Recursion/斐波那契数列.html)

## 回溯思想
> 回溯是一种渐进式寻找并构建问题解决方式的策略。我们从一个可能的动作开始并试着用这个动作解决问题。如果不能解决，就回溯并选择另一个动作直到将问题解决。根据这种行为，回溯算法会尝试所有可能的动作（如果更快找到了解决办法就尝试较少的次数）来解决问题。