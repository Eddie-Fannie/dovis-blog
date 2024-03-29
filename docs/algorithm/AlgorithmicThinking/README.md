# 算法设计与技巧
## 分而治之
- 分解原问题为多个子问题（原问题的多个小实例）
- 解决子问题，用返回解决子问题的方式递归算法。
- 组合这些子问题的解决方式，得到原问题的解。

## 动态规划
> 动态规划（`dynamic programming, DP`）是一种将复杂问题分解成更小的子问题来解决的优化技术。大致上，若要解一个给定问题，我们需要解其不同部分（即子问题），再根据子问题的解以得出原问题的解。动态规划往往用于优化递归问题，例如斐波那契数列，如果运用递归的方式来求解会重复计算很多相同的子问题，利用动态规划的思想可以减少计算量。

::: tip
动态规划和分而治之是不同的方法。分而治之方法是把问题分解成相互独立的子问题，然后组合它们的答案，而动态规划则是将问题分解成相互依赖的子问题。

斐波那契数列问题也是动态规划的一个例子，分解成一些小问题来解决。
:::

用动态规划解决问题时，遵循三个重要步骤：
- 定义子问题；
- 实现要反复执行来解决子问题的部分（递归）
- 识别并求解出边界条件。

**用备忘录来记录已经求解过的值可以使时间复杂度从`O(2^n)`变成`O(n)`**

> 首先，虽然动态规划的核心思想就是穷举求最值，但是问题可以千变万化，穷举所有可行解其实并不是一件容易的事，需要你熟练掌握递归思维，只有列出正确的「状态转移方程」，才能正确地穷举。而且，你需要判断算法问题是否具备「最优子结构」，是否能够通过子问题的最值得到原问题的最值。另外，动态规划问题存在「重叠子问题」，如果暴力穷举的话效率会很低，所以需要你使用「备忘录」或者「DP table」来优化穷举过程，避免不必要的计算。

> 自底向上：就是「递推」的思路，这也是动态规划一般都脱离了递归，而是由循环迭代完成计算的原因。

> 动态规划问题，具有「最优子结构」的。要符合「最优子结构」，子问题间必须互相独立

既然知道了这是个动态规划问题，就要思考如何列出正确的状态转移方程？
- 确定`base case`
- 确定[状态]，也就是原问题和子问题会变化的变量
- 确定[选择], 也就是导致状态产生变化的行为
- 明确`dp`函数/数组的定义：**一般来说函数的参数就是状态转移中会变化的量，也就是上面说到的「状态」；函数的返回值就是题目要求我们计算的量。**

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

### 背包问题
### 最长公共子序列`LCS`
> 找出两个字符串序列的最长子序列的长度。最长子序列是指，在两个字符串序列中以相同顺序出现，但不要求连续（非字符串子串）的字符串序列。**对于两个字符串求子序列的问题，都是用两个指针 i 和 j 分别在两个字符串上移动，大概率是动态规划思路。**

### 矩阵链相乘
### 图的全源最短路径


## 贪心算法
> 贪心算法遵循一种近似解决问题的技术，期盼通过每个阶段的局部最优选择（当前最好的解），从而达到全局的最优（全局最优解）。它不像动态规划算法那样计算更大的格局。

### 贪心算法解决上述硬币问题
```js
function minCoinChange(coins,amount) {
    const change = []
    let total = 0;
    for(let i=coins.length;i>=0;i--) {
        const coin = coins[i]
        while(total + coin <= amount) {
            change.push(coin)
            total += coin
        }
    }
    return change
}
```
::: tip
从最大面额的硬币开始，拿尽可能多的这种硬币找零。当无法再拿更多这种价值的硬币时，开始拿第二大价值的硬币，依次继续。

最常见的使用场景:
- 将xxx按照某种顺序排序，然后按这种顺序处理；
- 每次都取xxx中最大/小的值，并更新xxx，有时可以对xxx中最大/小的数值进行优化，比如用优先队列维护最大/小的数值。
:::

## 递归
能动态规划的都可以使用递归
[著名递归例子](/algorithm/AlgorithmicThinking/Recursion/斐波那契数列.html)

> 每个递归函数都有两部分：基线条件（`base case`）和递归条件（`recursive case`）。递归条件指的是函数调用自己，而基线条件则指的是函数不再调用自己，从而避免形成无限循环。**调用栈在递归中扮演重要角色，使用栈虽然很方便，但是也要付出代价：存储详尽的信息可能占用大量的内存。每个函数调用都要占用一定的内存，如果栈很高，就意味着计算机存储了大量函数调用的信息。**

- 可以选择循环
- 或者尾递归

## 回溯思想
> 回溯是一种渐进式寻找并构建问题解决方式的策略。我们从一个可能的动作开始并试着用这个动作解决问题。如果不能解决，就回溯并选择另一个动作直到将问题解决。根据这种行为，回溯算法会尝试所有可能的动作（如果更快找到了解决办法就尝试较少的次数）来解决问题。

- 用 `for` 循环去枚举出所有的选择
- 做出一个选择
- 基于这个选择，继续往下选择（递归）
- 上面的递归结束了，撤销这个选择，进入 `for` 循环的下一次迭代

> `dfs`参数肯定有：最终结果集，拼装元素的结果集，层数，数据源


## 滑动窗口
滑动窗口算法无非就是双指针形成的窗口扫描整个数组/子串，但关键是，你得清楚地知道什么时候应该移动右侧指针来扩大窗口，什么时候移动左侧指针来减小窗口。

