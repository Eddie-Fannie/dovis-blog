# Typescript 官方文档学习笔记

## Everyday Types（常见类型）

1. `Non-null Assertion Operator (Postfix !)`
> ! 操作符表示知道类型不会出现 `null|undefined`的一种类型断言。就像其他类型的断言一样，这不会改变代码的运行时行为，因此只有使用`!`，需要知道该值不能为`null`或`undefined`。

```js
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 使用 `is` 操作符来类型断言

```js
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## Exhaustiveness checking (The Never Type)
> `Never` 可分配给每种类型; 但是没有类型可分配给 `Never`（除非自身除外）。这意味着您可以使用`narrowing` 并依赖于 `switch` 语句中的穷举检查。

```js
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val
      return exhaustiveCheck;
  }
}

// 不能将其他类型 赋给 never类型
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

interface Baz {
  type: 'baz'
}
type All = Foo | Bar | Baz

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val // 会编译不通过
      return exhaustiveCheck;
  }
}
```

::: tip
1. 通过这个办法，你可以确保 `handleValue` 总是穷尽 (`exhaust`) 了所有 `All` 的可能类型。
:::

## More on Functions
> `TypeScript` 有很多种方式用来描述，函数可以以怎样的方式被调用。让我们来学习一下如何书写描述函数的类型（`types`）。

1. 函数类型表达式（`Function Type Expressions`）

```js
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

2. `call signatures` 调用签名

> 如果我们希望用属性描述一个可调用的东西，我们可以在对象类型中编写 `call signatures`。**注意这个语法跟函数类型表达式稍有不同，在参数列表和返回的类型之间用的是 `:` 而不是 `=>`**

```js
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

const test = (a: number) => a > 10;

test.description = 'Gahang';

doSomething(test)
```

3. `Construct Signatures` 构造签名

```js
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```
> 一些对象，比如 `Date` 对象，可以直接调用，也可以使用 `new` 操作符调用，而你可以将调用签名和构造签名合并在一起：

```js
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

4. `Generic Functions` 泛型函数

> 函数的输出类型依赖函数的输入类型，或者两个输入的类型以某种形式相互关联。在 `TypeScript` 中，泛型就是被用来描述两个值之间的对应关系。我们需要在函数签名里声明一个类型参数 (`type parameter`)

```js
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```
::: tip
- 通过给函数添加一个类型参数 `Type`，并且在两个地方使用它，我们就在函数的输入(即数组)和函数的输出(即返回值)之间创建了一个关联。现在当我们调用它，一个更具体的类型就会被判断出来。
:::

5. `Inference` 推断
> 在上面的例子中，我们没有明确指定 `Type` 的类型，类型是被 `TypeScript` 自动推断出来的。我们也可以使用**多个类型参数**。

```js
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

6. `Constraints` （约束）
> 有的时候，我们想关联两个值，但只能操作值的一些固定字段，这种情况，我们可以使用 **约束（`constraint`）**对类型参数进行限制。使用 `extends` 语法来约束函数参数。

```js
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob' 如果用let 定义则为 string类型
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

::: tip
- 正是因为我们对 `Type` 做了 `{ length: number }`限制，我们才可以被允许获取 `a b`参数的 `.length` 属性。没有这个类型约束，编译会报错，因为类型`Type`上不存在属性`length`。**基于传入的参数，`longerArray`和 `longerString` 中的类型都被推断出来了。记住，所谓泛型就是用一个相同类型来关联两个或者更多的值。**
:::

7. `Working with Constrained Values`(泛型约束实战)
> 一个使用泛型约束经常出现的错误：

```js
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

这个函数看起来像是没有问题，`Type` 被 `{ length: number}` 约束，函数返回 `Type` 或者一个符合约束的值。而这其中的问题就在于函数理应返回与传入参数相同类型的对象，而不仅仅是符合约束的对象。我们可以写出这样一段反例：

```js
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

8. `Specifying Type Arguments`（声明类型参数）
> `TypeScript` 通常能自动推断泛型调用中传入的类型参数，但也并不能总是推断出。举个例子，有这样一个合并两个数组的函数：

```js
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.

// 执意要这么做，可以手动指定 Type
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

::: tip
- 写一个好的泛型函数的一些建议:
  + 类型参数下移（`Push Type Parameters Down`）
  + 使用更少的类型参数 (`Use Fewer Type Parameters`)
  + 类型参数应该出现两次 （`Type Parameters Should Appear Twice`）**类型参数是用来关联多个值之间的类型。如果一个类型参数只在函数签名里出现了一次，那它就没有跟任何东西产生关联。如果一个类型参数仅仅出现在一个地方，强烈建议你重新考虑是否真的需要它。**
  + 当你写一个回调函数的类型时,不要写一个可选参数, 除非你真的打算调用函数的时候不传入实参
:::

9. 函数重载

10. `Declaring this in a Function` (在函数中声明 `this`)

```js
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```
> `TypeScript` 能够理解函数 `user.becomeAdmin` 中的 `this` 指向的是外层的对象 `user`，这已经可以应付很多情况了，但还是有一些情况需要你明确的告诉 `TypeScript this` 到底代表的是什么。在 `JavaScript` 中，`this` 是保留字，所以不能当做参数使用。但 `TypeScript` 可以允许你在函数体内声明 `this` 的类型。

```js
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) { // 此处不能使用箭头函数
  return this.admin;
});
```

11. 其他需要知道的类型（`Other Types to Know About`）
- `void`

> `void` 表示一个函数并不会返回任何值，当函数并没有任何返回值，或者返回不了明确的值的时候，就应该用这种类型。在 `JavaScript` 中，一个函数并不会返回任何值，会隐式返回 `undefined`，但是 `void` 和 `undefined` 在 `TypeScript` 中并不一样。

- `unknown`

> `unknown` 类型可以表示任何值。有点类似于 `any`，但是更安全，因为对 `unknown` 类型的值**做任何事情都是不合法的**：
>
> 你可以描述一个函数返回一个不知道什么类型的值

```js
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object is of type 'unknown'.
}

// 你可以描述一个函数返回一个不知道什么类型的值
function safeParse(s: string): unknown {
  return JSON.parse(s);
}
```

- `never`

> 一些函数从来不返回值。`never` 类型表示一个值不会再被观察到 `(observed)`。作为一个返回类型时，它表示这个函数会丢一个异常，或者会结束程序的执行。当 `TypeScript` 确定在联合类型中已经没有可能是其中的类型的时候，`never` 类型也会出现。

```js
// 异常
function fail(msg: string): never {
  throw new Error(msg);
}

// 确定在联合类型中已经没有可能是其中的类型的时候
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

12. 剩余参数
- 在 `TypeScript` 中，剩余参数的类型会被隐式设置为 `any[]` 而不是 `any`，如果你要设置具体的类型，必须是 `Array<T>` 或者 `T[]`的形式，再或者就是元祖类型`（tuple type）`。

```js
// Rest Parameters 剩余形参
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```
- 我们可以借助一个使用 `...`语法的数组，为函数提供不定数量的实参。注意一般情况下，`TypeScript` 并不会假定数组是不变的(`immutable`) 如：

```js
// Rest Parameters 剩余实参
const args = [8, 5];
const angle = Math.atan2(...args); // error: A spread argument must either have a tuple type or be passed to a rest parameter

// 利用 as const 修正为只读元祖
// Inferred as 2-length tuple
const args = [8, 5] as const;
const angle = Math.atan2(...args);
```

13. 参数解构 `Parameter Destructuring`

```js
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

// 上面的繁琐，可以这样：
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

14. `Assignability of Functions`（函数的可赋值性）

**返回 `void`**

- 函数有一个 `void` 返回类型，会产生一些意料之外，情理之中的行为。
- 当基于上下文的类型推导`（Contextual Typing）`推导出返回类型为 `void` 的时候，并不会强制函数一定不能返回内容。换句话说，如果这样一个返回 `void` 类型的函数类型 `(type vf = () => void)`， 当被应用的时候，也是可以返回任何值的，但返回的值会被忽略掉。
- 因此，下面这些`() => void` 类型的实现都是有效的：

```js
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};

// 即便这些函数的返回值赋值给其他变量，也会维持 void 类型
const v1 = f1();
const v2 = f2();
const v3 = f3();
```

::: tip
1. 正是因为有这个特效存在，下面的代码就不会编译报错：
```js
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

> 尽管 `Array.prototype.push` 返回一个数字，并且 `Array.prototype.forEach` 方法期待一个返回 `void` 类型的函数，但这段代码依然没有报错。就是因为基于上下文推导，推导出 `forEach` 函数返回类型为 `void`，正是因为不强制函数一定不能返回内容，所以上面这种 `return dst.push(el)` 的写法才不会报错。

2. 当一个函数字面量定义返回一个 `void` 类型，函数是一定不能返回任何东西的

```js
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```
:::

## Object Types
1. 可选属性 `? 修饰符`

```js
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```
2. `readonly Properties` 只读属性

```js
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = "hello";
  // Cannot assign to 'prop' because it is a read-only property.
}

// readonly 仅仅表明属性本身是不能被重新写入的。
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = {
  // Cannot assign to 'resident' because it is a read-only property.
    name: "Victor the Evictor",
    age: 42,
  };
}

// TypeScript 在检查两个类型是否兼容的时候，并不会考虑两个类型里的属性是否是 readonly，这就意味着，readonly 的值是可以通过别名修改的

interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

3. 索引签名 `Index Signatures`
> 有的时候，你不能提前知道一个类型里的所有属性的名字，但是你知道这些值的特征。

```js
interface StringArray {
  [index: number]: string;
}
```