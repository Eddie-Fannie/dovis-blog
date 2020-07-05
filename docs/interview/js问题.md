# js面试问题列表

## 初级题

1. **深浅拷贝的原理及实现拷贝**
> [js对象的深浅拷贝](/dovis-blog/basis/JavaScript/对象深浅拷贝)

2. **为什么0.1+0.2 != 0.3**
> 因为JS采用IEEE 754双精度版本。计算机中所有数据都是以二进制存储的，然后再计算结果转换成十进制。所以这个问题就是二进制精度发生了丢失

**解决精度丢失导致结果不精确**
```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```
**测试两个浮点数有没有丢失精确度**
```js
function judgeFloat(n, m) {
    const binaryN = n.toString(2);
    const binaryM = m.toString(2);
    console.log(`${n}的二进制是    ${binaryN}`);
    console.log(`${m}的二进制是    ${binaryM}`);
    const MN = m + n;
    const accuracyMN = (m * 100 + n * 100) / 100;
    const binaryMN = MN.toString(2);
    const accuracyBinaryMN = accuracyMN.toString(2);
    console.log(`${n}+${m}的二进制是${binaryMN}`);
    console.log(`${accuracyMN}的二进制是    ${accuracyBinaryMN}`);
    console.log(`${n}+${m}的二进制再转成十进制是${to10(binaryMN)}`);
    console.log(`${accuracyMN}的二进制是再转成十进制是${to10(accuracyBinaryMN)}`);
    console.log(`${n}+${m}在js中计算是${(to10(binaryMN) === to10(accuracyBinaryMN)) ? '' : '不'}准确的`);
}
  function to10(n) {
    const pre = (n.split('.')[0] - 0).toString(2);
    console.log(pre)
    const arr = n.split('.')[1].split('');
    console.log(arr)
    let i = 0;
    let result = 0;
    while (i < arr.length) {
      result += arr[i] * Math.pow(2, -(i + 1));
      i++;
    }
    console.log(result)
    return result;
  }
  judgeFloat(0.1,0.2)
```
## 中级题

## 高级题