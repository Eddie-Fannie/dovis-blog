# Typescript 官方文档学习笔记

## Everyday Types（常见类型）

1. `Non-null Assertion Operator (Postfix !)`
> ! 操作符表示知道类型不会出现 `null|undefined`的一种类型断言。就像其他类型的断言一样，这不会改变代码的运行时行为，因此只有使用`!`，需要知道该值不能为`null`或`undefined`。

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 使用 `is` 操作符来类型断言

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## Exhaustiveness checking (The Never Type)
> `Never` 可分配给每种类型; 但是没有类型可分配给 `Never`（除非自身除外）。这意味着您可以使用`narrowing` 并依赖于 `switch` 语句中的穷举检查。

```ts
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

```ts
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

```ts
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

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```
> 一些对象，比如 `Date` 对象，可以直接调用，也可以使用 `new` 操作符调用，而你可以将调用签名和构造签名合并在一起：

```ts
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

4. `Generic Functions` 泛型函数

> 函数的输出类型依赖函数的输入类型，或者两个输入的类型以某种形式相互关联。在 `TypeScript` 中，泛型就是被用来描述两个值之间的对应关系。我们需要在函数签名里声明一个类型参数 (`type parameter`)

```ts
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

```ts
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

6. `Constraints` （约束）
> 有的时候，我们想关联两个值，但只能操作值的一些固定字段，这种情况，我们可以使用 **约束（`constraint`）**对类型参数进行限制。使用 `extends` 语法来约束函数参数。

```ts
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

```ts
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

```ts
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

8. `Specifying Type Arguments`（声明类型参数）
> `TypeScript` 通常能自动推断泛型调用中传入的类型参数，但也并不能总是推断出。举个例子，有这样一个合并两个数组的函数：

```ts
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

```ts
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```
> `TypeScript` 能够理解函数 `user.becomeAdmin` 中的 `this` 指向的是外层的对象 `user`，这已经可以应付很多情况了，但还是有一些情况需要你明确的告诉 `TypeScript this` 到底代表的是什么。在 `JavaScript` 中，`this` 是保留字，所以不能当做参数使用。但 `TypeScript` 可以允许你在函数体内声明 `this` 的类型。

```ts
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

```ts
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

```ts
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

```ts
// Rest Parameters 剩余形参
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```
- 我们可以借助一个使用 `...`语法的数组，为函数提供不定数量的实参。注意一般情况下，`TypeScript` 并不会假定数组是不变的(`immutable`) 如：

```ts
// Rest Parameters 剩余实参
const args = [8, 5];
const angle = Math.atan2(...args); // error: A spread argument must either have a tuple type or be passed to a rest parameter

// 利用 as const 修正为只读元祖
// Inferred as 2-length tuple
const args = [8, 5] as const;
const angle = Math.atan2(...args);
```

13. 参数解构 `Parameter Destructuring`

```ts
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

```ts
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
```ts
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

> 尽管 `Array.prototype.push` 返回一个数字，并且 `Array.prototype.forEach` 方法期待一个返回 `void` 类型的函数，但这段代码依然没有报错。就是因为基于上下文推导，推导出 `forEach` 函数返回类型为 `void`，正是因为不强制函数一定不能返回内容，所以上面这种 `return dst.push(el)` 的写法才不会报错。

2. 当一个函数字面量定义返回一个 `void` 类型，函数是一定不能返回任何东西的

```ts
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

```ts
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

```ts
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
>
> 一个索引签名的属性类型必须是 `string` 或者是 `number`。虽然 `TypeScript` 可以同时支持 `string` 和 `number` 类型，但数字索引的返回类型一定要是字符索引返回类型的子类型。这是因为当使用一个数字进行索引的时候，`JavaScript` 实际上把它转成了一个字符串。

```ts
interface StringArray {
  [index: number]: string;
}

// 数字索引的返回类型一定要是字符索引返回类型的子类型
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```

4. 属性继承 (`Extending Types`)

- `interface`继承多个类型

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

5. 泛型对象类型 `Generic Object Types`

- `Array`本身就是一个泛型：

> 现代 `JavaScript` 也提供其他是泛型的数据结构，比如` Map<K, V>` ， `Set<T>` 和 `Promise<T>`。因为 `Map` 、`Set` 、`Promise`的行为表现，它们可以跟任何类型搭配使用。

```ts
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;

  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;

  // ...
}
```

- `ReadonlyArray` 类型（`The ReadonlyArray Type`）

> `ReadonlyArray` 是一个特殊类型，它可以描述数组不能被改变。

```ts
const test : ReadonlyArray<number> = [1, 2, 3, 4]
test.push(23); // // Property 'push' does not exist on type 'readonly number[]'.

// 不像 Array，ReadonlyArray 并不是一个我们可以用的构造器函数。
new ReadonlyArray("red", "green", "blue");

// typescript 提供更简写的方法
const test : readonly number[] = [1, 2, 3, 4]

// 最后有一点要注意，就是 Arrays 和 ReadonlyArray 并不能双向的赋值：
let x: readonly string[] = [];
let y: string[] = [];

x = y; // ok
y = x; // The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

- 元组类型（`Tuple Types`）

> 元组类型是另外一种 `Array` 类型，当你明确知道数组包含多少个元素，并且每个位置元素的类型都明确知道的时候，就适合使用元组类型。
>
> 在大部分的代码中，元组只是被创建，使用完后也不会被修改，所以尽可能的将元组设置为 `readonly` 是一个好习惯。如果我们给一个数组字面量 `const` 断言，也会被推断为 `readonly` 元组类型。

```ts
type StringNumberPair = [string, number];

// 如果我们给一个数组字面量 const 断言，也会被推断为 readonly 元组类型。

let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);

// Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
// The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'.
```

## `Generics` 泛型
1. `Generics Types` 泛型类型

```ts
// 泛型函数
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;

// 可以以对象类型的调用签名的形式，书写这个泛型类型：
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;

// 这可以引导我们写出第一个泛型接口，让我们使用上个例子中的对象字面量，然后把它的代码移动到接口里
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

2. `Generics Classes` 泛型类

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

::: tip
**一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数**

下面是一个更复杂的例子，使用原型属性推断和约束，构造函数和类实例的关系。

```ts
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```
:::

## `keyof` 操作符
> 对一个对象类型使用 `keyof` 操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合。

```ts
type Point = { x: number; y: number };
type P = keyof Point; // x | y

// 如果这个类型有一个 string 或者 number 类型的索引签名，keyof 则会直接返回这些类型
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
```
> 在上面代码第二个例子中，`M 是 string | number`，这是因为 `JavaScript` 对象的属性名会被强制转为一个字符串，所以 `obj[0]` 和 `obj["0"]` 是一样的。

### 数字字面量联合类型

> `keyof` 也可能返回一个数字字面量的联合类型，那什么时候会返回数字字面量联合类型呢，我们可以尝试构建这样一个对象。

```ts
const NumericObject = {
  [1]: "vue",
  [2]: "angular",
  [3]: "react"
};

type result = keyof typeof NumericObject

// typeof NumbericObject 的结果为：
// {
//   1: string;
//   2: string;
//   3: string;
// }
// 所以最终的结果为：
// type result = 1 | 2 | 3
```

## `typeof` 操作符
> `TypeScript` 添加的 `typeof` 方法可以在类型上下文（`type context`）中使用，用于获取一个变量或者属性的类型。在 `TypeScript` 中，只有对标识符（比如变量名）或者他们的属性使用 `typeof` 才是合法的。

```ts
// 对对象使用
const person = { name: "kevin", age: "18" }
type Kevin = typeof person;

// type Kevin = {
// 		name: string;
// 		age: string;
// }

// 对函数使用
function identity<Type>(arg: Type): Type {
  return arg;
}

type result = typeof identity; // type result = <Type>(arg: Type) => Type
```

### 对 `enum`数据类型使用 `typeof`
```ts
enum UserResponse {
  No = 0,
  Yes = 1,
}

// 编译成Javascript：
var UserResponse;
(function (UserResponse) {
  UserResponse[UserResponse["No"] = 0] = "No";
  UserResponse[UserResponse["Yes"] = 1] = "Yes";
})(UserResponse || (UserResponse = {}));

console.log(UserResponse)
// { '0': 'No', '1': 'Yes', No: 0, Yes: 1 }

// 对enum使用typeof
const a: result = {
  "No": 2,
  "Yes": 3
}

// result 类型类似于：
// {
//	"No": number,
//  "YES": number
// }
```
> 不过对一个 `enum` 类型只使用 `typeof` 一般没什么用，通常还会搭配 `keyof` 操作符用于获取属性名的联合字符串。

```ts
type result = keyof typeof UserResponse;
// type result = "No" | "Yes"
```

## 索引访问类型 `Indexed Access Types`

```ts
// 我们可以使用 索引访问类型（indexed access type） 查找另外一个类型上的特定属性
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // type Age = number

//因为索引名本身就是一个类型，所以我们也可以使用联合、keyof 或者其他类型：
type I1 = Person["age" | "name"];  // type I1 = string | number

type I2 = Person[keyof Person]; // type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];  // type I3 = string | boolean

// 我们使用 number 来获取数组元素的类型。结合 typeof 可以方便的捕获数组字面量的元素类型
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];

// type Person = {
//    name: string;
//    age: number;
// }

type Age = typeof MyArray[number]["age"];  // type Age = number

type Age2 = Person["age"];  // type Age2 = number

// 作为索引的只能是类型，这意味着你不能使用 const 创建一个变量引用
const key = "age";
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?


// 我们怎么根据一个数组获取它的所有值的字符串联合类型呢？
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app) {
  // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```
::: tip
1. 首先是使用 `as const` 将数组变为 `readonly` 的元组类型
2. 但此时 `APP` 还是一个值，我们通过 `typeof` 获取 `APP` 的类型

```ts
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```

3. 最后在通过索引访问类型，获取字符串联合类型
:::