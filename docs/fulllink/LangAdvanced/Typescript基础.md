# Typescript入门知识
> 看`Typescript`入门教程的一些记录

## 基础
```js
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```
进行`tsc`编译时编辑器会提示错误，但是还是生成了`js`文件。**这是因为 `TypeScript` 编译的时候即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件。如果要在报错的时候终止 `js` 文件的生成，可以在 `tsconfig.json` 中配置 `noEmitOnError` 即可。**

## 原始数据类型
- 空值
JavaScript 没有空值（`Void`）的概念，在 `TypeScript` 中，可以用 `void` 表示没有任何返回值的函数。**声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`**

- `Null`和`Undefined`
与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量。**而 `void` 类型的变量不能赋值给 `number` 类型的变量：**

```js
let u: number = undefined; // 不会报错

let u: void;
let num: number = u; // Type 'void' is not assignable to type 'number'
```

## 类型推论
```js
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```
> `TypeScript` 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查。

### 联合类型（Union Types)
> 表示取值可以为多种类型的一种。使用`|`进行分隔。联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```js
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// basic.ts:12:30 - error TS2339: Property 'length' does not exist on type 'number'.
```

## 接口
```js
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: 'Tom',
  age: 25
};
```
::: tip
1. 接口一般首字母为大写。
2. 赋值的时候，变量的形状必须和接口的形状保持一致。多属性、少属性都是不允许的。这个时候可以用可选属性来不完全匹配一个形状。

```js
interface Person {
  name: string;
  age?: number;
}

let tom: Person = {
  name: 'Tom'
};

// 仍然不允许添加未定义的属性。
```

3. 任意属性
```js
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male'
};
```
> 使用 `[propName: string]` 定义了任意属性取 `string` 类型的值。需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。**这里是任意属性取`string`，才会有这种说法**

```js
interface Person {
  name: string;
  age?: number;
  [propName: string]: string;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
  gender: 'male'
};
// basic.ts:17:3 - error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.

// basic.ts:21:5 - error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Property 'age' is incompatible with index signature.
//     Type 'number' is not assignable to type 'string'.
```

> 一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：

```js
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
  gender: 'male'
};
```
4. 只读属性
> 有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性。
:::

## 数组
```js
// 最简单的方式
let array : number[] = [1,2,3,4];

// 泛型
let arr: Array<number> = [1,2,3];
```

::: tip
- 用接口表示数组

```js
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

`NumberArray` 表示：只要索引的类型是数字时，那么值的类型必须是数字。
虽然接口也可以用来描述数组，但是我们一般不会这么做，因为这种方式比前两种方式复杂多了。**不过有一种情况例外，那就是它常用来表示类数组**。

- 类数组
```js
function sum() {
  let args: number[] = arguments;
}
// basic.ts:28:7 - error TS2740: Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 15 more.
```

> `arguments` 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口。事实上常用的类数组都有自己的接口定义（内置对象），如 `IArguments`, `NodeList`, `HTMLCollection` 等

```js
// IArguments 接口实际
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
```
:::

## 函数
### 函数声明
输入的参数个数严格把控，可以利用可选参数不传某些参数。**可选参数后不能出现必需参数**

> 在 `ES6` 中，我们允许给函数的参数添加默认值，`TypeScript` 会将添加了默认值的参数识别为可选参数。此时就不受「可选参数必须接在必需参数后面」的限制了！

```js
function sum(x: number, y: number): number {
  return x + y;
}
```
### 函数表达式
```js
let mySum = function (x: number, y: number): number {
  return x + y;
};

```
> 这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 `mySum`，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 `mySum` 添加类型，则应该是这样：

```js
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y;
};
```

::: tip
注意不要混淆了 `TypeScript` 中的 `=>` 和 ES6 中的 `=>`。在 `TypeScript` 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
:::

### 用接口定义函数的形状
> 采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1;
}
```

### 函数重载
```js
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```
::: tip
上例中，我们重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。注意，`TypeScript` 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。**重载可以避免不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串**。
:::

## 类型断言
`值 as 类型`或者`<类型>值`

::: warning
在 `tsx` 语法中必须使用前者，即 值 `as` 类型。

形如 `<Foo>` 的语法在 `tsx` 中表示的是一个 `ReactNode`，在 `ts` 中除了表示类型断言之外，也可能是表示一个泛型。
:::

## 声明文件
将声明语句放到一个单独的以`（.d.ts)`后缀命名的文件中，就是声明文件。

### declare var
在所有的声明语句中，`declare var` 是最简单的，如之前所学，它能够用来定义一个全局变量的类型。与其类似的，还有 `declare let` 和 `declare const`，使用 `let` 与使用 `var` 没有什么区别：

```js
// src/jQuery.d.ts

declare let jQuery: (selector: string) => any;
```
> 一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 `const` 而不是 `var` 或 `let`。**需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的实现**

### declare function
`declare function` 用来定义全局函数的类型。**在函数类型的声明语句中，函数重载也是支持的**

## 内置对象
`JavaScript` 中有很多内置对象，它们可以直接在 `TypeScript` 中当做定义好了的类型。内置对象是指根据标准在全局作用域`（Global）`上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 `DOM`）的标准。

### ECMAScript的内置对象
`Boolean/Error/Date/RegExp`等

```js
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```
### DOM和BOM内置对象
`Document/HTMLElement/Event/NodeList`等

::: tip
[TypeScript核心库的定义文件](https://github.com/microsoft/TypeScript/blob/main/src/lib) 中定义了所有浏览器环境需要用到的类型，并且是预置在 `TypeScript` 中的。
:::

### 用Typescript写Node.js
`Node.js` 不是内置对象的一部分，如果想用 `TypeScript` 写 `Node.js`，则需要引入第三方声明文件：

```bash
npm install @types/node --save-dev
```