# Map
## Map概念
ES6提供了Map数据结构，类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包含对象）都可以当作键。是一种更完善的`Hash`结构实现。**`Object`数据结构的键仅局限于字符串类型**。

## `Map`的方法

- **`Map`结构的`set`方法，将对象o当作m的一个键，然后又使用`get`方法读取这个值,`set`方法返回是当前的`Map`对象，因此可以采用链式写法** 

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