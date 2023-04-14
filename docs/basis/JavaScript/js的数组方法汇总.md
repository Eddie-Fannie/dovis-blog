# JS的数组方法汇总
举例讲解一些JS的数组方法，如`reduce()`、`map()`等

## `reduce`
- 接受一个函数作为累加器，数组中的每个值开始缩减，最终计算为一个值。
- 可以作为一个高阶函数，用于函数的`compose`
- 对于空数组是不会执行回调函数的

```js
array.reduce(function(total,current,currentIndex,arr), initialValue)
```
**参数解析**
1. `total`: 函数传进来的初始值或上一次回调的返回值
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
::: tip
- 如果没有提供 `initialValue`，那么第一次调用 `callback` 函数时，`accumulator` 使用原数组中的第一个元素，`currentValue` 即是数组中的第二个元素。 在没有初始值的空数组上调用 `reduce` 将报错。
- 如果提供了 `initialValue`，那么将作为第一次调用 `callback` 函数时的第一个参数的值，即 `accumulator，currentValue` 使用原数组中的第一个元素。
- 如果提供了`initialValue`则起始索引号为`0`，否则为`1`
```js
[1, 2, 3, 4].reduce((x, y) => console.log(x, y)); //1 2 undefined 3 undefined 4
```
`reducer` 函数接收4个参数:

1. `Accumulator (acc)` (累计器)
2. `Current Value (cur)` (当前值)
3. `Current Index (idx)` (当前索引)
4. `Source Array (src)` (源数组)

`reducer` 函数的返回值将会分配给累计器，该返回值在数组的每个迭代中被记住，并最后成为最终的单个结果值。
`reducer` 函数还有一个可选参数 `initialValue`, 该参数将作为第一次调用回调函数时的第一个参数的值。如果没有提供 `initialValue`，则将使用数组中的第一个元素。
在上述例子， `reduce`方法接收的第一个参数(`Accumulator`)是 `x`, 第二个参数(`Current Value`)是 `y`。
- 在第一次调用时，累加器 `x`为 `1`，当前值 `“y”`为 `2`，打印出累加器和当前值：`1`和 `2`。
- 例子中我们的回调函数没有返回任何值，只是打印累加器的值和当前值。如果函数没有返回值，则默认返回 `undefined`。在下一次调用时，累加器为 `undefined`，当前值为`3`, 因此 `undefined`和 `3`被打印出。
- 在第四次调用时，回调函数依然没有返回值。累加器再次为 `undefined` ，当前值为`4`。`undefined`和 `4`被打印出。
:::

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

## `for...of`
::: tip

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
- `for...in` 是 `JavaScript` 最早的遍历语法，用来遍历对象的可枚举属性。`for...in` 遍历对象的顺序是不确定的，因此不能保证属性的顺序。此外，由于遍历的是属性名，所以遍历出来的是**字符串类型**。在遍历数组时，`for...in` 会将数组的索引遍历出来（字符串类型，**普通`for/forEach`循环为数值类型**），但是会遍历原型链上的属性，因此需要使用 `Object.prototype.hasOwnProperty` 方法判断是否是对象自身的属性。`for...in` 也无法使用 `break` 或 `return` 终止循环。
- `for...of` 是 `ES6` 新引入的遍历语法，可以遍历具有 `Iterable` 接口的数据结构（如数组、`Map`、`Set` 等），以及实现了自定义迭代器的对象。`for...of` 通过迭代器对象的 `next` 方法来遍历每个元素，并且可以使用 `break` 或 `return` 终止循环。`for...of` 无法遍历对象。
- `forEach` 是 `Array` 类型的一个方法，它接受一个函数作为参数，对数组的每个元素都调用一次该函数，并传入当前元素、当前索引和整个数组。`forEach` 无法使用 `break` 或 `return` 终止循环。`forEach` 无法遍历对象。
:::

**`for...of`的魅力**
1. 数组迭代
```js
const products = ['oranges','apples']
for(const product of products) {
  console.log(product)
}

// 就地解构
const persons = [
  {name: 'John Smith'},
  {name: 'Jane Doe'}
]
for(const {name} of persons) {
  console.log(name)
}
```

2. 类数组迭代
```js
function sum() {
  let sum = 0
  for(const number of arguments) {
    sum += number
  }
  return sum;
}
sum(1,2,3) // 6
```

3. 遍历字符串
4. 遍历对象，`map/set`
```js
// Map
const names = new Map();
names.set(1, 'one');
names.set(2, 'two');

for (const [number, name] of names) {
  console.log(number, name);
}
// logs 1, 'one'
// logs 2, 'two'

// Set
const colors = new Set(['white', 'blue', 'red', 'white']);

for (color of colors) {
  console.log(color);
}
// 'white'
// 'blue'
// 'red

// 对象
const person = {
  name: 'John Smith',
  job: 'agent'
};

for (const [prop, value] of Object.entries(person)) {
  console.log(prop, value);
}
// 'name', 'John Smith'
// 'job', 'agent'
```

## `map()`
> `map()`方法定义在JavaScript的`Array`中，它返回一个新的数组，数组中的元素为原始数组调用函数处理后的值。**不会改变原数组，不会对空数组进行检测**

```js
array.map(function(currentValue, index, arr), thisIndex) // thisIndex: 可选。对象作为该执行回调时使用，传递给函数，用作"this"的值。

let array = [1, 2, 3, 4, 5];
let newArray = array.map((item) => {
  return item * item;
})
console.log(newArray)  // [1, 4, 9, 16, 25]
```