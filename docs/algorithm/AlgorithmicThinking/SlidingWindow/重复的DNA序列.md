# 187.重复的DNA序列
所有 `DNA` 都由一系列缩写为 `'A'，'C'，'G'` 和 `'T'` 的核苷酸组成，例如：`"ACGAATTCCG"`。在研究 `DNA` 时，识别 `DNA` 中的重复序列有时会对研究非常有帮助。

编写一个函数来找出所有目标子串，目标子串的长度为 `10`，且在 `DNA` 字符串 `s` 中出现次数超过一次。

```bash
输入：s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
输出：["AAAAACCCCC","CCCCCAAAAA"]

输入：s = "AAAAAAAAAAAAA"
输出：["AAAAAAAAAA"]

```

## 思路
用长度为 `10` 的窗口去截取出 子串，把它出现的次数统计在 `map` 中
在移动窗口截取子串的过程中，一旦有子串的出现次数达到 `2`
就将该子串推入 `res` 数组
最后返回 `res` 数组

## 解答
```js
/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function(s) {
    let result = []
    let seenTimes = {}
    let start=0;
    let len = s.length;
    while(start+10<=len) {
        let str = s.substr(start,10)
        seenTimes[str] = seenTimes[str] + 1 || 1
        if(seenTimes[str] === 2) {
            result.push(str)
        }
        start++
    }
    return result
};
```