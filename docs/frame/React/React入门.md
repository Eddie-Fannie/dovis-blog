# React入门
## JSX简介
1. 可以通过使用引号，来将属性值指定为字符串字面量。也可以使用大括号，来在属性值中插入一个js表达式。
```js
const element = <div tabIndex="0"></div>

const element = <img src={user.avatarUrl}></img> // 标签没有内容，可以使用 /> 来闭合标签
```
> 在属性中嵌入js表达式时，不要在大括号外面加上引号。你应该仅使用引号或大括号中的一个，对于同一属性不能同时使用这两种符号。

::: tip
因为 `JSX` 语法上更接近 `JavaScript` 而不是 `HTML`，所以 `React DOM` 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 `HTML` 属性名称的命名约定。

例如，`JSX` 里的 `class` 变成了 `className`，而 `tabindex` 则变为 `tabIndex`。
:::

2. `React DOM` 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 `XSS`（`cross-site-scripting`, 跨站脚本）攻击。

3. `Babel`会把JSX转译成一个名为`React.createElement()`函数调用。以下两种示例代码完全等效：
```js
const element = ( // 括号
  <h1 className="greeting">
   Hello,world!
  </h1>
)

const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

::: tip
`React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```js
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

> 这些对象被称为 “`React` 元素”。它们描述了你希望在屏幕上看到的内容。`React` 通过读取这些对象，然后使用它们来构建 `DOM` 以及保持随时更新。
:::

## 元素渲染
1. 将一个元素渲染为`DOM`
假设`HTML`文件某处有一个`<div>`
```js
<div id="root"></div>
```

::: tip
我们将其称为“根” `DOM` 节点，因为该节点内的所有内容都将由 `React DOM` 管理。
仅使用 `React` 构建的应用通常只有单一的根 `DOM` 节点。如果你在将 `React` 集成进一个已有应用，那么你可以在应用中包含任意多的独立根 DOM 节点。
想要将一个 `React` 元素渲染到根 `DOM` 节点中，只需把它们一起传入 `ReactDOM.render()`：

```js
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```
:::

2. 更新已渲染的元素
`React` 元素是不可变对象。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。
根据我们已有的知识，更新 UI 唯一的方式是创建一个全新的元素，并将其传入 `ReactDOM.render()`。

::: tip
在实践中，大多数 `React` 应用只会调用一次 `ReactDOM.render()`。
:::

## 组件 & Props
> 组件，从概念上类似于 `JavaScript` 函数。它接受任意的入参（即 “`props`”），并返回用于描述页面展示内容的 `React` 元素。

### 函数组件
定义组件最简单的方式就是编写js函数：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
> 该函数是一个有效的 `React` 组件，因为它接收唯一带有数据的 “`props`”（代表属性）对象与并返回一个 `React` 元素。这类组件被称为“函数组件”，因为它本质上就是 `JavaScript` 函数。

### `class`组件
同时还可以使用ES6的`class`来定义组件：
```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
### 渲染组件
```js
const element = <Welcome name="Sara" />
```

::: tip
当 `React` 元素为用户自定义组件时，它会将 `JSX` 所接收的属性`（attributes）`以及子组件`（children）`转换为单个对象传递给组件，这个对象被称之为 `“props”`。

**注意： 组件名称必须以大写字母开头。`React` 会将以小写字母开头的组件视为原生 `DOM` 标签。例如，`<div />` 代表 `HTML` 的 `div` 标签，而 `<Welcome />` 则代表一个组件，并且需在作用域内使用 `Welcome`。**

1. 组件无论是使用函数声明还是通过 `class` 声明，都决不能修改自身的 `props`。
2. 所有 `React` 组件都必须像纯函数一样保护它们的 `props` 不被更改。
:::

## `State` & 生命周期
`State`与`props`类似，但是`state`是私有的，并且完全受控于当前组件。

```js
import * as React from 'react';
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

export default Clock;
```

::: tip
我们可以为`class`组件声明一些特殊的方法，当组件挂载或卸载就会去执行这些方法：
这些方法叫做生命周期方法。

1. `componentDidMount()`方法会在组件已经被渲染到`DOM`中后运行

2. 概括一下发生了什么和这些方法到调用顺序：
- 当 `<Clock />` 被传给 `ReactDOM.render()`的时候，`React` 会调用 `Clock` 组件的构造函数。因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 `state`。
- 之后 `React` 会调用组件的 `render()` 方法。这就是 `React` 确定该在页面上展示什么的方式。然后 `React` 更新 `DOM` 来匹配 `Clock` 渲染的输出。
- 当 `Clock` 的输出被插入到 `DOM` 中后，`React` 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。
- 浏览器每秒都会调用一次 `tick()` 方法。 在这方法之中，`Clock` 组件会通过调用 `setState()` 来计划进行一次 UI 更新。得益于 `setState()` 的调用，`React` 能够知道 `state` 已经改变了，然后会重新调用 render() 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此以来就会渲染输出更新过的时间。`React` 也会相应的更新 `DOM`。
- 一旦 `Clock` 组件从 `DOM` 中被移除，`React` 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。
:::