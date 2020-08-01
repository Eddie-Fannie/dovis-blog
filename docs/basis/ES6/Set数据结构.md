# Set数据结构
> `Set`本身是一个构造函数，用来生成`Set`数据结构，成员的值唯一。

1. `Set`函数可以接收一个数组（或者具有`iterable`数据结构）作为参数，用来初始化。
2. `Set`函数内部使用（`===`）运算符来判断是否相等，所以不会类型转换，不过内部两个`NaN`是相等的。两个对象总是不相等。

## Set实例的属性和方法
- `Set.prototype.constructor`：构造函数，默认为`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

+ 操作方法
    - `add(value)`：添加某个值，返回`Set`结构本身
    - `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功
    - `has(value)`：返回一个布尔值，表示参数是否为`Set`成员
    - `clear()`：清除所有成员，没有返回值。

+ 遍历方法
    - `keys()`：返回键名的遍历器
    - `values()`：返回键值的遍历器
    - `entries()`：返回键值对的遍历器
    - `forEach()`：使用回调函数遍历每个成员。
> `Set`的遍历顺序就是插入顺序。使用`Set`保存一个回调函数列表，调用时就能保证按照添加顺序调用。由于`Set`结构没有键名，可以说键名和键值一样，所以`keys()`和`values()`方法一致。

```js
for(let item of set.entries()) {
    console.log(item)
}
```

::: tip
`Set`结构的实例默认可遍历，默认遍历器生成函数就是它的`values`方法。这意味着可以省略`values`方法，直接用`for...of`遍历`Set`
```js
let set = new Set(['red','green','blue'])
for(let x of set) {
    console.log(x)
}
// red
// green
// blue
```
:::

## 结合`filter`和`map`使用
```js
let set = new Set([1,2,3])
set = new Set([...set].map(x => x*2))
// [2,4,6]

//实现两个数组的交集
let a = new Set([1,2,3])
let b = new Set([4,3,2])

let intersect = new Set([...a].filter(x => b.has(x)))

// 并集
let union = new Set([...a,...b])
// 差集
let difference = new Set([...a].filter(x => !b.has(x)))
```

## `WeakSet`
`WeakSet`结构和`Set`类似，也是不重复的值的集合。但是有两点区别：
1. `WeakSet`的成员必须为对象
2. `WeakSet`中的对象都是弱引用，即垃圾回收机制不考虑`WeakSet`对该对象的引用，也就是说其他对象都不再引用该对象，那么垃圾回收机制就会自动回收该对象所占用的内存，不考虑该对象是否还存在于`WeakSet`之中。`WeakSet`里面的引用都不计入垃圾回收机制。**ES6规定了`WeakSet`不能遍历。**

## `WeakSet`语法
```js
const ws = new WeakSet()
```
> 作为构造函数，`WeakSet`可以接收一个数组或者类似数组的对象作为参数。成为`WeakSet`的成员也必须为对象
```js
const b = [3,4]
const ws = new WeakSet(b);// Uncaught TypeError: Invalid value used in weak set(...)
```
因为数组b的成员不是对象，所以会报错。

`WeakSet`实例同样也有`add delete has`方法，没有`size`属性，因为不能遍历。**因为成员都是弱引用，随时都可能消失，遍历机制无法保证成员存在，很可能刚遍历结束成员就取不到了**

## `WeakSet`用处
1. 存储`DOM`节点，不用担心这些节点从文档移除会引发内存泄漏。