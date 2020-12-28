# 数组问题
## 栈/队列方法
`pop()/shift()`都是返回被删除的项。`push()/unshift()`返回操作后数组的长度。都会影响原数组。

::: tip
`Shift()`    删除数组的第一个元素，返回被删除的元素，`arr.shift()`
`Unshift() ` 向数组开头添加一个或多个元素，返回新的长度，`arr.unshift(e1,e2..)`
`Pop()`     删除数组最后一个元素，返回被删除的元素，`arr.pop()`
`Push()`    向数组尾部添加一个或多个元素，返回新的长度，`arr.push(e1,e2..)`

```js
var datas=[10,20,30];
datas.unshift(40,50);  // 首部添加 [40,50,10,20,30]
data.pop();  // 尾部删除  [40,50,10,20]
datas.push(60,70);  // 尾部添加 [40,50,10,20,60,70]
data.shift();  // 首部删除  [50,10,20,60,70]
```
:::

## 合并方法
`concat`不会影响原数组

## 转换方法
> 调用`valueOf()`返回是数组本身，调用`toString()`方法返回由数组中每个值的字符串形式拼接而成的一个以逗号为分隔的字符串。

```js
[].valueOf() // []
[].toString() // ''

{}.valueOf() // {}
{}.toString() // [object Object]
```

## 重排序方法
`sort()`方法是按字符串来比较的，所以会出现`10<5`的情况。该方法和`reverse()`一样都会影响原来的数组

```js
[0,1,3,10,33,22].sort((v1,v2) => {return v1-v2})
```

## 操作方法
1. `slice()`方法：
::: tip
如果该方法的参数中有一个负数，则用数组长度加上该数来确定相应的位置。如果结束位置小于起始位置则返回空数组。

**这个方法不会影响原来的数组**
:::

2. `splice()`方法：
- 删除：可以删除任意数量的项，只需要传入要删除的第一项的位置，和要删除的项数。
- 插入：可以向指定位置插入任意数量的项。参数为：起始位置，要删除的项数（一般为`0`，代表不删除），要插入的项
- 替换：向指定位置插入任意数量的项，同时删除任意数量的项。起始位置，要删除的项数和要插入的项。

::: tip
**该方法会影响原来的数组**，并且返回一个数组，返回的数组中包含原来数组中删除的项，如果没有删除的项则返回一个空数组。
:::

## 位置方法
`indexOf()`和`lastIndexOf()`。这两个方法都接收两个参数，要查找的项和查找起点位置的索引（可选）。返回要查找的项在数组的位置，没有找到则返回`-1`，要查找的项必须严格相等（`===`），所以`NaN`就查找不出来。**找出符合条件的第一个数组成员即可**

## 迭代方法
> ES5定义了`5`个迭代方法，都带两个参数。要在每一项运行的函数和运行该函数的作用域对象（影响`this`的值，可选）。函数参数则接收三个参数：数组项的值，该项在数组的位置和数组对象本身。

- `every()`：对数组每一项运行函数，对每一项都返回`true`，则返回`true`
- `some()`：和前一个方法不同的地方在于，不需要每一项，有一项返回`true`就足够了
- `filter()`：对数组每一项运行给定函数，返回该函数会返回`true`的项组成数组。
- `map()`：与前一个方法区别在于，返回的是每次函数调用的结果组成数组。
- `forEach()`：这个方法没有返回值。本质上和使用`for`循环数组一样。可以参考[具体讲解](/basis/JavaScript/js的数组方法汇总.html#foreach)

## 归并方法
[`reduce()`](/basis/JavaScript/js的数组方法汇总.html#reduce)和`reduceRight()`（从数组最后一项开始）

## 数组去重
1. 利用ES6的`Set`去重
```js
function unique(arr) {
  return Array.from(new Set(arr))
}
var arr = ['a','d','d','d','a',1,2,3,3,4,true,true]
console.log(unique(arr)) // ["a", "d", 1, 2, 3, 4, true]
```

简化版本：
```js
[...new Set(arr)]
```

2. 利用ES5中的`splice`方法。**双层循环，外层循环元素，内层循环时比较值。值相同时，则删去这个值。**
```js
function unique(arr) {
    for(var i=0;i<arr.length;i++) {
        for(var j=i+1;j<arr.length;j++) {
            if(arr[i] == arr[j]) {
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
```
3. 利用`indexOf` **新建一个空的结果数组，`for` 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则`push`进数组。**

> `stringObject/Array.indexOf(searchvalue,fromIndex)`方法可以返回某个指定的字符串在字符串中首次出现的位置。`searchvalue`必需。规定需检索的字符串值。`fromIndex`可选的整数参数。规定在字符串中开始检索的位置。合法值为`0-stringObject.length-1`。省略该参数，则将从字符串首字符开始检索。

```js
function unique(arr) {
    if(!Array.isArray(arr)) {
        console.log('type error')
        return
    }
    var array = []
    for(var i=0;i<arr.length;i++) {
        if(array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array
}
```

4. 利用`sort`。**利用`sort()`排序方法，然后根据排序后的结果进行遍历及相邻元素比对。**
```js
function unique(arr) {
    if(!Array.isArray(arr)) {
        console.log('type eror')
        return;
    }
    arr = arr.sort()
    var array = [arr[0]]
    for(var i=1;i<arr.length;i++) {
        if(arr[i] !== arr[i-1]) {
            array.push(arr[i])
        }
    }
    return array;
}
```
::: tip
`sort()`方法：**改变原始数组**
```js
arrayObject.sort(sortby) // sortby 可选。规定排序顺序必须是函数。
```
> 如果调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序，说得更精确点，是按照字符编码的顺序进行排序。要实现这一点，首先应把数组的元素都转换成字符串（如有必要），以便进行比较。**这种排序的方式为字典序(alphanumeric)，即根据数组内元素首字母进行排序，此方法排序会改变原数组的顺序。**

> 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：

- 若 `a` 小于 `b`，在排序后的数组中 `a` 应该出现在 `b` 之前，则返回一个小于 `0` 的值。
- 若 `a` 等于 `b`，则返回 `0`。
- 若 `a` 大于 `b`，则返回一个大于 `0` 的值。
:::

利用冒泡来排序
```js
Array.prototype.bubbleSort = function() {
    let arr = this,
        len = arr.length;
    for(let outer = len; outer >= 2; outer--) {
        for(let inner = 0; inner<= outer -1; inner++) {
            if(arr[inner] > arr[inner +1]) {
                // 升序
                [arr[inner], arr[inner +1]] = [arr[inner +1], arr[inner]];
            }
        }
    }
    return arr;
}
```

利用选择排序
```js
Array.prototype.selectSort = function() {
    let arr = this;
        len = arr.length;
    for(let i = 0, len= this.arr.length;i<len;i++) {
        for(let j=i, len= this.arr.length; j<len;j++) {
            if(this.arr[i] > this.arr[j]) {
                [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]]
            }
        }
    }
    return arr;
}
```

5. 利用对象属性不能相同
```js
function unique(arr) {
    if(!Array.isArray(arr)) {
        console.log('type eror')
        return;
    }
    var array = []
    var obj = {}
    for(var i=0;i<arr.length;i++) {
        if(!obj[arr[i]]) {
            array.push(arr[i])
            obj[arr[i]] = 1
        } else {
            obj[arr[i]]++
        }
    }
    return array;
}
```

6. 利用`includes`
> `Array.prototype.includes`采用了`SameValueZero（）`进行比较，内部利用`Map/Set`。所以也可以判断到`NaN`

```js
function unique(arr) {
    if(!Array.isArray(arr)) {
        console.log('type eror')
        return;
    }
    var array = []
    for(var i=0;i<arr.length;i++) {
        if(!array.includes(arr[i])) {
            array.push(arr[i])
        }
    }
    return array;
}
```
7. 利用`hasOwnProperty`
```js
function unique(arr) {
  var obj = {}
  return arr.filter(item => {
    return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
  })
}
var arr = ['a','d','d','d','a',1,2,3,3,4,true,true]
console.log(unique(arr)) // ["a", "d", 1, 2, 3, 4, true]
```

8. 利用`filter`
```js
function unique(arr) {
  return arr.filter((item, index, arr) => {
    return arr.indexOf(item,0) === index; // 当前元素，在原始数组中的第一个索引===当前索引值，否则返回当前元素。
  })
}
```

9. 利用递归
```js
function unique(arr) {
  var array = arr;
  var len = arr.length;
  array.sort((a, b) => {
    return a-b;
  })
  function loop(index) {
    if(index >=1) {
      if(array[index] === array[index -1]) {
        array.splice(index, 1)
      }
      loop(index-1)
    }
  }
  loop(len-1)
  return array;
}
```

10. 利用`Map`数据结构
```js
function arrayNonRepeatfy(arr) {
    let map = new Map();    
    let array = new Array();  // 数组用于返回结果
    for (let i = 0; i < arr.length; i++) {
        if(map.has(arr[i])) {  // 如果有该key值
          map.set(arr[i], true); 
        } else { 
          map.set(arr[i], false);   // 如果没有该key值
          array.push(arr[i]);
        }
      }   
    return array ;
}
```

## ES6新增的数组方法
1. `Array.from()`
> 该方法用于将两类对象转为真正的数组：类似数组的对象和可遍历对象（包括`Set/Map`数据结构），类似数组的对象本质特征只有一点就必须有`length`属性。

```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3 // 必须指定
}

// ES5写法
var arr1 = [].slice.call(arrayLike); // ['a','b','c']

[].concat.apply([], arguments)
Array.prototype.slice.call(arguments) // apply也可以

// ES6
var arr2 = Array.from(arrayLike)
```
::: tip
常见类似数组的对象：
- `DOM`操作返回的`NodeList`集合
- 函数内部的`arguments`对象
:::

只要是部署了`Iterator`接口的数据结构，都可以转为真正的数组。**扩展运算符也可以将某些数据结构转为数组**。任何有`length`属性的对象都可以通过`Array.from()`转为数组，但是扩展运算符在这种情况下就没办法转换。**仅考虑`0`和正整数的索引，`slice`会产生稀疏数组，内容是`empty`而不是`undefined`。类数组`push`操作的是索引值为`length`的位置**
```js
Array.from({length: 3}) // [undefined, undefined, undefined]
```

`Array.from()`还能接收第二个参数，实现类似`map`的功能。
```js
Array.from([1,2,3], (x) => x*x) // [1,4,9]

Array.from({length: 2}, () => 'jack') // ['jack','jack']

// 第一个参数指定了第二个参数运行的次数，可以更灵活。
```

2. `Array.of()`
> 弥补构造函数`Array()`的不足，因为参数个数不同导致的行为差异，基本可以用来替代`new Array()/Array()`
```js
Array.of(3) // [3]
Array(3) // [, , ,]
```

3. `copyWithin()`
> 会在当前数组内部将指定位置的成员复制到其他位置，会修改原始数组。

+ 接收参数：都为数值，不是就会自动转为数值。负值则用数组长度去减。
    - `target`：必选，从该位置开始替换数据
    - `start`：可选，从该位置开始读取数据，默认为`0`。如果为负值表示倒数。
    - `end`：可选。到该位置停止读取数据，默认等于数组长度。如果为负值，表示倒数。

```js
[1,2,3,4,5].copyWithin(0,3) // [4,5,3,4,5]

// 没有部署TypedArrayd的copyWithin方法的平台
[].copyWithin.call(new Init32Array([1,2,3,4,5]),0,3,4) // Init32Array [4,2,3,4,5]
```
4. `find()`和`findIndex()`
> 数组实例的`find()`方法找出第一个符合条件的数组成员。参数第一个是回调函数，第二个则是用来绑定回调函数的`this`对象。回调函数直到找到返回`true`的成员并且返回该成员，否则返回`undefined`。回调函数的参数：当前的值，当前的位置和原数组。`findIndex()`方法类似，只不过返回的是当前位置，不符合则返回`-1`。

```js
[1,4,-5,10].find((n) => n<0) // -5
```
`find()`方法和`indexOf()`方法的区别在于前者可以找到`NaN`，后者不行
```js
[NaN].indexOf(NaN) // -1
```

5. `fill()`
用定值填充一个数组
```js
['a','b','c'].fill(7) // [7,7,7]

new Array(3).fill(8) // [8,8,8]
```
该方法可以接收第二个和第三个参数，用于指定填充的起始/结束位置。

6. `entries() key() values()`
用于遍历数组，可用`for...of`循环遍历。
```js
for(let index of ['a','b'].keys()) {
    console.log(index) // 0 1
}

for(let item of ['a','b'].values()) {
    console.log(item) // 'a' 'b'
}

for(let [index,item] of ['a','b'].entries()) {
    console.log(index, item) 
    // 0 'a'
    // 1 'b'
}
```
::: tip
如果不使用`for..of`循环，则手动调用遍历器对象的`next`方法进行遍历
```js
let letter = ['a','b','c']
let entries = letter.entries()
console.log(entries.next().value) // [0, 'a']
console.log(entries.next().value) // [1, 'b']
console.log(entries.next().value) // [2, 'c']
```
:::

7. `includes()`
> 返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes`方法类似。该方法接收第二个参数表示搜索的起始位置，默认为`0`。如果第二个参数为负数则表示倒数，负数绝对值比长度大就会重置为`0`

## 数组的空位
```js
[, , ,] // 空位[empty,empty,empty]
``` 
> 空位不是`undefined`，一个位置的值等于`undefined`依然有值。空位是没有任何值，`in`运算符可以说明
```js
 0 in [undefined,undefined] // true
 0 in [, ,] // false
```

+ ES5处理空位的情况：
    - `forEach() filter() some() every() reduce()`会跳过空位
    - `map()`跳过空位，**不过会保留这个值**
    - `join() toString()`会将空位视为`undefined`，而`undefined/null`会转为空字符串

ES6则明确表示空位转为`undefined`
::: tip
- `Array.from`方法会将数组的空位转为`undefined`。扩展运算符也是
- `copyWithin()`会连空位一起复制。
- `fill()`会将空位视为正常的数组位置。
- `for...of`循环也会遍历空位。
- `entries()/keys()/values()/find()/findIndex()`会将空位处理成`undefined`。
:::

## ES10新增的数组方法
1. `flat()` 数组扁平化
- `Array.prototype.flat()` 用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
- 不传参数时，默认“拉平”一层，可以传入一个整数，表示想要“拉平”的层数。
- 传入 `<=0` 的整数将返回原数组，不“拉平”
- `Infinity` 关键字作为参数时，无论多少层嵌套，都会转为一维数组
- 如果原数组有空位，`Array.prototype.flat()` 会跳过空位。

```js
[1,[2,3]].flat(2) // [1,2,3]
[1,[2,3,[4,5]]].flat(3) // [1,2,3,4,5]
[1,[2,3,[4,5,[...]]]].flat(Infinity) // [1,2,3,4,5...n]
```

利用递归和数组合并方法来实现扁平
```js
function flatten(arr) {
    while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr;
}
// 或者
function flattenArray(arr) {
  const flattened = [].concat(...arr);
  return flattened.some(item => Array.isArray(item)) ?
    flattenArray(flattened) : flattened;
}
 
const arr = [11, [22, 33], [44, [55, 66, [77, [88]], 99]]];
const flatArr = flattenArray(arr);
```

::: tip
循序渐进完善`flat`函数
- 初版，拍平成一层
```js
// 递归
let myFlat = function(flatArr) {
  let result = []
  for(let i of flatArr) {
    if(Array.isArray(i)) {
      result.push(...myFlat(i))
    } else {
      result.push(i)
    }
  }
  return result
}

// 迭代
function flatten(arr) {
    let arrs =[...arr]
    let newArr = [];
    while (arrs.length){
        let item = arrs.shift()
        if(Array.isArray(item)){
            arrs.unshift(...item)
        }else {
            newArr.push(item)
        }
    }
    return newArr
}
```
:::

## 如何更好使用数组
1. 使用`Array.includes`代替`Array.indexOf`
> 如果我们仅需要知道数组中是否包含给定元素呢？这意味着只是是与否的区别，这是一个布尔问题（`boolean question`）。针对这种情况，我建议使用直接返回布尔值的 `Array.includes`。

2. 使用`Array.find`替代`Array.filter`
> 如果知道经回调函数过滤后，只会剩余唯一的一项，那么我不建议使用 `Array.filter`。比如：使用等于某个唯一 `ID` 为过滤条件去过滤一个数组。在这个例子中，`Array.filter` 返回一个仅有一项的新数组。然而，我们仅仅是为了获取 `ID` 为特定 `ID` 的那一项，这个新数组显得毫无用处。让我们讨论一下性能。为了获取所有符合回调函数过滤条件的项，`Array.filter` 必须遍历整个数组。如果原数组中有成千上万项，回调函数需要执行的次数是相当多的。为避免这些情况，我建议使用 `Array.find`。它与 `Array.filter` 一样需要一个回调函数，（但只是返回）符合条件的第一项。当找到符合回调函数过滤条件的第一个元素时，它会立即停止往下的搜寻。不再遍历整个数组。**`Array.find()`没有找到返回`undefined`**

3. 使用`Array.reduce`替代`Array.filter`和`Array.map`的结合