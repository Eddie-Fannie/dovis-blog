# JS的数组方法汇总
举例讲解一些JS的数组方法，如`reduce()`、`map()`等

## `reduce`
- 接受一个函数作为累加器，数组中的每个值开始缩减，最终计算为一个值。
- 可以作为一个高阶函数，用于函数的`compose`
- 对于空数组是不会执行回调函数的

```js
array.reduce(function(prev,current,currentIndex,arr), initialValue)
```
**参数解析**
1. `prev`: 函数传进来的初始值或上一次回调的返回值
2. `current`：数组中当前处理的元素值
3. `currentIndex`：当前元素索引
4. `arr`: 当前元素所属的数组本身
5. `initialValue`: 传给函数的初始值

- 不同初始值下的情况
    + 初始值为数值：
    ```js
    const arr = [1,2,3,4,5,6,7,8,9,10]
    const sum = arr.reduce(function(prev,current){
        return prev + current
    },4)
    console.log(sum) 
    /*
    输出59
    reduce根据函数传进来的初始值，不断回调叠加最终算出数组的和
    */
    ```
    + 初始值为对象：
    ```js
    const arr = [1,2,3,4,5,6,7,8,9,10]
    const sum = arr.reduce(function(prev,current){
        prev.count = prev.count + current
        return prev
    },{count: 0})
    console.log(sum)
    //输出{count:55}
    ```
    + 初始值为数组：
    ```js
    const str = 'hello'
    const newstr = str.split('')
    const result = newstr.reduce(function(prev,current){
        const obj = {}
        obj.current = current;
        prev.push(obj)
        return prev
    },[])
    console.log(newstr)
    /* [ { current: 'h' },
    { current: 'e' },
    { current: 'l' },
    { current: 'l' },
    { current: 'o' } ]
    */
    ```

## `forEach`
> `forEach()`方法用于调用数组的每个元素，并将元素传递给回调函数。**对于空数组是不会执行回调函数的**

> 没有返回值，所以不支持链式调用

```js
array.forEach(function(currentValue, index, arr), thisValue)
```
| 参数 | 描述 | 
| ---- | ----|
| function(currentValue, index, arr) | 必需 （`currentValue`当前元素；`index`可选，当前元素的索引值；`arr`可选，当前元素所属的数组对象。|
| thisValue | 可选，传递给函数的值一般用`this`值，如果这个值为空，则`undefined`或`null`会传递给`this`的值 |

例子1:
```js
function foo(el,index) {
    console.log(el, this.id, index);
}
var obj = {
    id: 'awesome'
}
var arr = [1,2,3]
arr.forEach(foo,obj); 
// 1 'awesome' 0
// 2 'awesome' 1
// 3 'awesome' 2
```
例子2:
> 如果使用箭头函数来传入函数参数，`thisValue`会被忽略：
```js
function a(el) { 
    console.log(this.id + el) // 5 6 7
}
let arr = [1, 2, 3]
let obj = {
    id: 4
}
arr.forEach((el) => {
    console.log(this.id + el) // NaN NaN NaN
}, obj)
arr.forEach(a, obj)
```

例子3: 对象复制器函数
```js
function copy(obj) {
  const copy = Object.create(Object.getPrototypeOf(obj));
  const propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function(name) {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}

const obj1 = { a: 1, b: 2 };
const obj2 = copy(obj1); // 现在 obj2 看起来和 obj1 一模一样了
```

例子4: 如果数组在迭代时被修改了，则其他元素会被跳过
```js
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
```

例子5: 扁平化数组（也可以利用`Array.prototype.flat()`方法）
```js
/**
 * Flattens passed array in one dimensional array
 *
 * @params {array} arr
 * @returns {array}
 */
function flatten(arr) {
  const result = [];
  arr.forEach((i) => {
    if (Array.isArray(i))
      result.push(...flatten(i));
    else
      result.push(i);
  })
  return result;
}
// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
flatten(problem); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

例子6: 验证

## `for...of`
::: tip
`for...in`用于对数组或对象进行循环操作。
`for...of`语句遍历可迭代对象定义要迭代的数据。只循环集合本身元素

```js
var a = ['A','B','C']
a.name = "Hello"
for(var x in a) {
  console.log(x) // '0','1','2','name'
}
// for...in循环把name包括在内，但Array的length属性却不在内。
// for...of修复这个问题
var a = ['A','B','C']
a.name = 'Hello'
for(var x of a) {
  console.log(x) // A,B,C
}
```
- `for...in`用于数组遍历时，索引转为字符串了，而普通`for/forEach`循环为数值类型
- 遍历顺序是对象属性的枚举顺序，并不一定按数组的下标顺序来遍历。
:::