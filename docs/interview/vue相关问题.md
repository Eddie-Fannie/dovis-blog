# vue面试相关问题
## vdom的key
> 更新子节点时，需要在`oldChildren`中循环去找一个节点。但是如果我们在模板中渲染列表时，为子节点设置了属性`key`，那么就生成了一个`key`对应着一个节点下标这样一个对象。也就是说，如果在节点设置了属性`key`，那么在`oldChildren`中找相同节点是，可以直接通过`key`拿到下标，从而拿到节点，根本不需要通过循环来查找节点。

::: tip
需要使用 `key` 来给每个节点做一个唯一标识， `Diff` 算法就可以正确的识别此节点。作用主要是为了高效的更新虚拟 `DOM`。

如果不使用 `key`，`Vue`会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用`key`，它会基于`key`的变化重新排列元素顺序，并且会移除 `key` 不存在的元素。
:::

## 对`MVVM`的理解
> `MVVM` 是 `Model-View-ViewModel` 的缩写。`Model`代表数据模型，也可以在`Model`中定义数据修改和操作的业务逻辑。`View` 代表`UI` 组件，它负责将数据模型转化成`UI` 展现出来。`ViewModel` 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步`View` 和 `Model`的对象，连接`Model和View`。在`MVVM`架构下，`View` 和 `Model` 之间并没有直接的联系，而是通过`ViewModel`进行交互，`Model` 和 `ViewModel` 之间的交互是双向的， 因此`View` 数据的变化会同步到`Model`中，而`Model` 数据的变化也会立即反应到`View` 上。`ViewModel` 通过双向数据绑定把 `View` 层和 `Model` 层连接了起来，而`View` 和 `Model` 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作`DOM`, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 `MVVM` 来统一管理。

## Vue的生命周期
- `beforeCreate`（创建前）：在数据观测和初始化事件还未开始。
- `created`（创建后）： 完成数据观测，属性和方法的运算，初始化事件，`$el`属性还没有显示出来
- `beforeMount`（载入前）： 在挂载开始之前被调用，相关的`render`函数首次被调用。实例已完成以下的配置：编译模板，把`data`里面的数据和模板生成`html`。注意此时还没有挂载`html`到页面上。**`$el` 为可用状态，但 `ref` 仍不可用。**
- `mounted`（载入后）： 在`el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的`html`内容替换`el`属性指向的`DOM`对象。完成模板中的`html`渲染到`html`页面中。此过程中进行`ajax`交互。
- `beforeUpdate`（更新前）： 在数据更新之前调用，发生在虚拟`DOM`重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
- `updated`（更新后）： 在由于数据更改导致的虚拟`DOM`重新渲染和打补丁之后调用。调用时，组件`DOM`已经更新，所以可以执行依赖于`DOM`的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
- `beforeDestroy`（销毁前）： 在实例销毁之前调用。实例仍然完全可用。**此阶段适合在更新之前访问现有的 `DOM`，比如手动移除已添加的事件监听器。`ref`能使用**
- `destroyed`（销毁后）： 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。**`ref` 状态为 `undefined`。**

## Vue实现数据双向绑定的原理
> `vue`实现数据双向绑定主要是：采用**数据劫持结合发布者-订阅者模式**的方式，通过`Object.defineProperty（）`来劫持各个属性的`setter，getter`，在数据变动时发布消息给订阅者，触发相应监听回调。

> 当把一个普通 `Javascript` 对象传给 `Vue` 实例来作为它的 `data` 选项时，`Vue` 将遍历它的属性，用 `Object.defineProperty` 将它们转为 `getter/setter`。用户看不到 `getter/setter`，但是在内部它们让 `Vue` 追踪依赖，在属性被访问和修改时通知变化。

> `vue`的数据双向绑定 将`MVVM`作为数据绑定的入口，整合`Observer`，`Compile`和`Watcher`三者，通过`Observer`来监听自己的`model`的数据变化，通过`Compile`来解析编译模板指令（`vue`中是用来解析 `{{}}`），最终利用`watcher`（更新函数）搭起`observer`和`Compile`之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（`input`）—>数据`model`变更双向绑定效果。

![img](/dovis-blog/other/21.png)

**实现简单的双向绑定**
```html
<input type="text" id="txt">
<div id="show">
    
</div>
```
```js
let domContainer = document.getElementById('show')
let inputContainer = document.getElementById('txt');
let object = {}
Object.defineProperty(object, 'txt', {
    get() {
        return '';
    },
    set(newValue) {
        inputContainer.value = newValue
        domContainer.innerHTML = newValue
    }
})
document.addEventListener('keyup', (e) => {
    object.txt = e.target.value
})
```

::: tip
- `Oberver（数据监听器/发布者）`：负责对数据对象对所有属性进行监听（数据劫持），监听到数据发生变化后通知订阅者。
- `Compiler`指令解析器：扫描模版，并对指令进行解析，然后绑定指定事件。
- `Watcher`订阅者：关联前两个，能够订阅并收到属性变动通知，执行指令绑定的相应操作，更新视图。`Update()`自身一个方法，用于执行`Compiler`中绑定的回调，更新视图。
:::

## `$route和$router`区别
> `$route`是“路由信息对象”，包括`path，params，hash，query，fullPath，matched，name`等路由信息参数。而`$router`是“路由实例”对象包括了路由的跳转方法，钩子函数等。

## 计算属性的好处
1. 使得数据处理结构清晰；
2. 依赖于数据，数据更新，处理结果自动更新；
3. 计算属性内部`this`指向`vm`实例；
4. 在`template`调用时，直接写计算属性名即可；
5. 常用的是`getter`方法，获取数据，也可以使用`set`方法改变数据；
6. 相较于`methods`，不管依赖的数据变不变，`methods`都会重新计算，但是依赖数据不变的时候`computed`从缓存中获取，不会重新计算。

## `delete`和`Vue.delete`删除数组的区别
> `delete`只是被删除的元素变成了 `empty/undefined` 其他的元素的键值还是不变。`Vue.delete`直接删除数组，改变了数组的键值。

::: tip
+ `delete`知识点补充：
    - `delete` 操作符用来删除一个对象的属性。
    - `delete`在删除一个不可配置的属性时在严格模式和非严格模式下的区别:
    1. 在严格模式中，如果属性是一个不可配置（non-configurable）属性，删除时会抛出异常;
    2. 非严格模式下返回 `false`。
    - `delete`能删除的：
    1. 可配置对象的属性
    2. 隐式声明的全局变量(这个全局变量其实是`global`对象(`window`)的属性)
    3. 用户定义的属性 
    4. 在ECMAScript 6中，通过 `const` 或 `let` 声明指定的 `"temporal dead zone" (TDZ)` 对 `delete` 操作符也会起作用
    - `delete`不能删除：
    1. 显式声明的全局变量 
    2. 内置对象的内置属性 
    3. 一个对象从原型继承而来的属性
    - `delete`删除数组元素：
    1. 当你删除一个数组元素时，数组的 `length` 属性并不会变小，数组元素变成`undefined`
    2. 当用 `delete` 操作符删除一个数组元素时，被删除的元素已经完全不属于该数组。
    3. 如果你想让一个数组元素的值变为 `undefined` 而不是删除它，可以使用 `undefined` 给其赋值而不是使用 `delete` 操作符。此时数组元素是在数组中的
    - `delete` 操作符与直接释放内存（只能通过解除引用来间接释放）没有关系。

```js
var a = [1,2,3,4]
delete a[2]
console.log(a) // [1,2,empty,4]
console.log(a[2]) // undefined
console.log(a.length) // 4
```
:::

## Vue的`template`编译
> 简而言之，就是先转化成`AST`树，再得到的`render`函数返回`VNode`（`Vue`的虚拟`DOM`节点），详细步骤如下：

::: tip
1. 首先，通过`compile`编译器把`template`编译成`AST`语法树（`abstract syntax tree` 即 源代码的抽象语法结构的树状表现形式），`compile`是`createCompiler`的返回值，`createCompiler`是用以创建编译器的。另外`compile`还负责合并`option`。

2. 然后，`AST`会经过`generate`（将`AST`语法树转化成`render funtion`字符串的过程）得到`render`函数，`render`的返回值是`VNode`，`VNode`是`Vue`的虚拟`DOM`节点，里面有（标签名、子节点、文本等等）
:::

## `sync`修饰符
> 作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 `v-on` 监听器。
```js
<comp :foo.sync="bar"></comp>

// 扩展为：
<comp :foo="bar" @update:foo="val => bar = val"></comp>

// 当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：
this.$emit('update:foo', newValue)
```

## vue-router实现路由懒加载（动态加载路由）
::: tip
- `vue`异步组件技术 ==== 异步加载，`vue-router`配置路由 , 使用`vue`的异步组件技术 , 可以实现按需加载 .但是,这种情况下一个组件生成一个js文件。
- 路由懒加载(使用`import`)。
- `webpack`提供的`require.ensure()`，`vue-router`配置路由，使用`webpack`的`require.ensure`技术，也可以实现按需加载。这种情况下，多个路由指定相同的`chunkNam`，会合并打包成一个`js`文件。
:::

## vue中判断用户首次进入页面还是刷新页面
![img](/dovis-blog/other/54.png)

## vue的Mixin合并策略（`Vue.extend`也是)
当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。比如数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
- 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
- 值为对象的选项，如`methods/components/directives`将被合并同一个对象。两个对象键名冲突时，取组件对象的键值对。

## v-model原理
::: tip
我们在 `vue` 项目中主要使用 `v-model` 指令在表单 `input、textarea、select` 等元素上创建双向数据绑定，我们知道 `v-model` 本质上不过是语法糖，`v-model` 在内部为不同的输入元素使用不同的属性并抛出不同的事件。
- `text` 和 `textarea` 元素使用 `value` 属性和 `input` 事件；
- `checkbox`和`radio`使用`checked`属性和`change`事件
- `select`字段符`value`作为`prop`并将`change`作为事件。
:::

```html
<input v-model='something'>
    
<input v-bind:value="something" v-on:input="something = $event.target.value">
```
如果在自定义组件中，`v-model` 默认会利用名为 `value` 的 `prop` 和名为 `input` 的事件

```html
父组件：
<ModelChild v-model="message"></ModelChild>
子组件：
<div>{{value}}</div>
props:{
    value: String
},
methods: {
  test1(){
     this.$emit('input', '小红')
  },
}
```

## `keep-alive`的理解
`keep-alive` 是 `Vue` 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：
- 一般结合路由和动态组件一起使用，用于缓存组件；
- 提供 `include` 和 `exclude` 属性，两者都支持字符串或正则表达式， `include` 表示只有名称匹配的组件会被缓存，`exclude` 表示任何名称匹配的组件都不会被缓存 ，其中 `exclude` 的优先级比 `include` 高；
- 对应两个钩子函数 `activated` 和 `deactivated` ，当组件被激活时，触发钩子函数 `activated`，当组件被移除时，触发钩子函数 `deactivated`

## vue 路由中 hash 模式和 history 模式区别
`hash` 模式：
- `hash` 出现在 `URL` 中，但不会被包含在 `http` 请求中，对后端完全没有影响，因此改变`hash` 不会重新加载页面。

`history`模式：
- `history` 利用了 `html5 history` 中新增的 `pushState()`和`replaceState()` 方法。这两个方法应用于浏览器记录栈，在当前已有的`back、forward、go`基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的`URL`，但浏览器不会立即向后端发送请求。

## vue2 和 vue3 区别
1. 响应式
- 2.x 的响应式是基于`Object.defineProperty`实现的代理，能够监听数据对象的变化，但是监听不到对象属性的增删，数组元素和长度变化，同时`Vue`初始化的时候会把所有`Observer`建立，实现数据视图与数据的响应式更新，底层需要`Observer`的支持，所以需要`Observer`都建立好，才能观察到数据对象的变化。
- 3.0 中使用 `es6` 的`Proxy`来代替`Object.defineProperty`，在目标对象之上架一层拦截，代理的是对象而不是对象的属性。这样可以将原本对象属性的操作变为对整个对象的操作，可以监听到对象的属性的增删和数组长度的变化，还可以监听`Map,Set,WeakMap,WeakSet`等，同时实现了惰性监听，即不会再初始化的时候创建所有`observer`，而是会在用到的时候再监听。

2. 模板
2.x的机制导致作用域插槽变了，父组件会重新渲染，而3.0把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升渲染性能。
