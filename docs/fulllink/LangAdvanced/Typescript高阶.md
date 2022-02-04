# Typescript 高阶

## `interface` 和 `type`（类型别名 `type alias`） 的区别

1. 属性继承

```ts
// interface 属性继承 Extending Types
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear()
bear.name
bear.honey

// type 交叉类型 Intersections Types
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
> `interface` 可以 `extends`， 但 `type` 是不允许 `extends` 和 `implement` 的，但是 `type` 却可以通过交叉类型实现 `interface` 的 `extend` 行为，并且两者并不是相互独立的，也就是说 `interface` 可以 `extends type`, `type` 也可以 与 `interface` 类型交叉 。

::: tip
> 这两种方式在合并类型上看起来很相似，但实际上还是有很大的不同。最原则性的不同就是在于冲突怎么处理，这也是你决定选择那种方式的主要原因。

```ts
interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number
}

// Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
// Types of property 'color' are incompatible.
// Type 'number' is not assignable to type 'string'.
```

使用继承的方式，如果重写类型会导致编译错误，但交叉类型不会:

```ts
interface Colorful {
  color: string;
}

type ColorfulSub = Colorful & {
  color: number
}
```
这个时候虽然编译不会报错了，那么`color`的类型是啥呢。答案是`never`,取得是 `string` 和 `number` 的交集。
:::

2. 重复添加属性（声明合并）
```ts
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

```ts
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```