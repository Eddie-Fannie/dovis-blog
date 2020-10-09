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
- `beforeMount`（载入前）： 在挂载开始之前被调用，相关的`render`函数首次被调用。实例已完成以下的配置：编译模板，把`data`里面的数据和模板生成`html`。注意此时还没有挂载`html`到页面上。
- `mounted`（载入后）： 在`el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的`html`内容替换`el`属性指向的`DOM`对象。完成模板中的`html`渲染到`html`页面中。此过程中进行`ajax`交互。
- `beforeUpdate`（更新前）： 在数据更新之前调用，发生在虚拟`DOM`重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
- `updated`（更新后）： 在由于数据更改导致的虚拟`DOM`重新渲染和打补丁之后调用。调用时，组件`DOM`已经更新，所以可以执行依赖于`DOM`的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
- `beforeDestroy`（销毁前）： 在实例销毁之前调用。实例仍然完全可用。
- `destroyed`（销毁后）： 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

## Vue实现数据双向绑定的原理
> `vue`实现数据双向绑定主要是：采用**数据劫持结合发布者-订阅者模式**的方式，通过`Object.defineProperty（）`来劫持各个属性的`setter，getter`，在数据变动时发布消息给订阅者，触发相应监听回调。

> 当把一个普通 `Javascript` 对象传给 `Vue` 实例来作为它的 `data` 选项时，`Vue` 将遍历它的属性，用 `Object.defineProperty` 将它们转为 `getter/setter`。用户看不到 `getter/setter`，但是在内部它们让 `Vue` 追踪依赖，在属性被访问和修改时通知变化。

> `vue`的数据双向绑定 将`MVVM`作为数据绑定的入口，整合`Observer`，`Compile`和`Watcher`三者，通过`Observer`来监听自己的`model`的数据变化，通过`Compile`来解析编译模板指令（`vue`中是用来解析 `{{}}`），最终利用`watcher`搭起`observer`和`Compile`之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（`input`）—>数据`model`变更双向绑定效果。

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

## 如何优化单页应用首屏加载速度慢的问题？
- 将公用的`JS`库通过`script`标签外部引入，减小 `app.bundel` 的大小，让浏览器并行下载资源文件，提高下载速度；
- 在配置路由时，页面和组件使用懒加载的方式引入，进一步缩小 `app.bundel` 的体积，在调用某个组件时再加载对应的`js`文件；
- 加一个首屏`loading`图，提升用户体验；

## axios的特点
- 从浏览器中创建`XMLHttpRequests`；
- `node.js`创建`http`请求；
> `axios`可以用在浏览器和 `node.js` 中是因为，它会自动判断当前环境是什么，如果是浏览器，就会基于`XMLHttpRequests`实现`axios`。如果是`node.js`环境，就会基于`node`内置核心模块`http`实现`axios`

- 支持`Promise API`；
- 拦截请求和响应；
- 转换请求数据和响应数据；
- 取消请求；
- 自动换成`json`。
- `axios`中的发送字段的参数是`data`跟`params`两个，两者的区别在于`params`是跟请求地址一起发送的，`data`的作为一个请求体进行发送
- `params`一般适用于`get`请求，`data`一般适用于`post put` 请求。
- 客户端支持防御`CSRF`

## vue-router实现路由懒加载（动态加载路由）
::: tip
- `vue`异步组件技术 ==== 异步加载，`vue-router`配置路由 , 使用`vue`的异步组件技术 , 可以实现按需加载 .但是,这种情况下一个组件生成一个js文件。
- 路由懒加载(使用`import`)。
- `webpack`提供的`require.ensure()`，`vue-router`配置路由，使用`webpack`的`require.ensure`技术，也可以实现按需加载。这种情况下，多个路由指定相同的`chunkNam`，会合并打包成一个`js`文件。
:::

## vue中判断用户首次进入页面还是刷新页面
![img](/dovis-blog/other/54.png)