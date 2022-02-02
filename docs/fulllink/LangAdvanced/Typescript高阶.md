# Typescript 高阶

## `interface` 和 `type`（类型别名 `type alias`） 的区别

1. 继承
```js
// interface
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear()
bear.name
bear.honey

// type
type Animal = {
  name: string
}

type Bear = Animal & {
  honey: boolean
}

const bear = getBear();
bear.name;
bear.honey;
```
> `interface` 可以 `extends`， 但 `type` 是不允许 `extends` 和 `implement` 的，但是 `type` 缺可以通过交叉类型 实现 `interface` 的 `extend` 行为，并且两者并不是相互独立的，也就是说 `interface` 可以 `extends type`, `type` 也可以 与 `interface` 类型 交叉 。

2. 重复添加属性（声明合并）
```js
// interface (Adding new fields to an existing interface)

interface Animal {
  name: string
}

interface Animal {
  age: number
}

const me: Animal = {
  age: 10,
  name: "linjiaheng"
}

// type (A type cannot be changed after being created)
type Animal = {
  name: string,
}

type Animal = {
  age: 20,
}

// Error: Duplicate identifier 'Animal'.
```

3. `type` 可以声明基本类型别名，联合类型，元组等类型,还可以使用 `typeof` 获取实例的类型进行赋值。

```js
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```