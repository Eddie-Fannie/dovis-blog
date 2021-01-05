# Map
## Map概念
ES6提供了`Map`数据结构，类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包含对象）都可以当作键。是一种更完善的`Hash`结构实现。**`Object`数据结构的键仅局限于字符串类型**。

## `Map`的方法

- **`Map`结构的`set`方法，将对象`o`当作`m`的一个键，然后又使用`get`方法读取这个值,`set`方法返回是当前的`Map`对象，因此可以采用链式写法** 

```javascript
const m = new Map();
const o = {p: 'Hello world'};
m.set(o,'content')
m.get(o) //'content'
m.has(o) //true
m.delete(o)//true
m.has(o)//false
```

- **`Map`作为构造函数，`Map`可以接受一个数组作为参数，该数组的成员是一个个表示键值对的数组。**  

  ```javascript
  const map = new Map([                         
    ['name','张三'],
    ['title','Author']
  ])       
  map.size//2
  map.has('name')//true
  map.get('name')//'张三'
  // 上面代码新建Map实例时，就指定了两个键name和title
  ```

  **上述构造函数实例中执行的是以下算法** 

  ```javascript
  const items = [
    ['name', '张三'],
    ['title', 'Author']
  ];
  const map = new Map();
  items.forEach(
  	([key,value]) => map.set(key, value)
  )
  ```

- **`size`属性返回`Map`结构的成员总数** 

::: tip
- 只有对同一个对象的引用，`Map`结构才将其视为同一个键
- 如果`Map`的键是一个简单类型的值，则只要两个值严格相等，`Map`就将其视为一个键，包括`0`和`-0`。另外`NaN`不严格等于自身，但`Map`将其视为同一个键。

**实例的属性和操作方法**
- `size`属性。返回`Map`结构的成员总数。
- `set`方法设置键值，返回整个`Map`结构。
- `get`方法读取`key`对应的键值，如果找不到`key`，则返回`undefined`。
- `has`判断某个键是否在`Map`数据结构中，返回一个布尔值
- `delete`方法删除某个键，返回`true`。如果删除失败则返回`false`
- `clear`清除所有成员，没有返回值。
:::

## `Map`遍历方法 

- `Map.prototype.keys()`;返回键名的遍历器
- `Map.prototype.values()`;返回键值的遍历器
- `Map.prototype.entries()`;返回所有成员的遍历器
- `Map.prototype.forEach()`;遍历Map所有成员

```javascript
const map = new Map([
  ['F','no'],['T','yes']
])
for(let key of map.keys()){
  console.log(key);//"F","T"
}
for(let value of map.values()){
  console.log(value)//"no","yes"
}
for(let item of map.entries()){
  console.log(item[0],item[1])
  //"F" "no"
  //"T" "yes"							
}
//或者
for(let [key,value] of map.entries()){
  console.log(key,value)
}
//"F" "no"
//"T" "yes"
//等同于使用map.entries()
for(let [key,value] of map) {
  console.log(key,value)
}
//"F" "no"
//"T" "yes"
```
> 上面的最后例子表示，`Map`结构的默认遍历器接口(`Symbol.iterator`属性)就是`entries`方法。

```js
map[Symbol.iterator] === map.entries
```

## Map结构和其他结构转换
1. `Map-->Array`
```js
const map = new Map([
  ['1','one'],
  ['2','two'],
  ['3','three']
])

[...map]
// [[1,'one'],[2,'two'],[3,'three']]
```

2. `Array --> Map`
将数组传入`Map`构造函数即可

## `WeakMap`
`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合

- `WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名
- `WeakMap`的键名所指向的对象，不计入垃圾回收机制
- `WeakMap`弱引用的只是键名而不是键值。键值依然是正常引用的。
- `WeakMap`不存在遍历方法，也没有`size`属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，和垃圾回收机制是否运行相关。同时也不支持`clear`方法。