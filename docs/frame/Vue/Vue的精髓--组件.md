# Vue的精髓--组件
## 组件的分类

1. 由 `vue-router` 产生的每个页面，本质上也是组件。这类组件相对是最好写的，因为主要是还原设计稿，完成需求，不需要太多模块和架构设计上的考虑。

2. 不包含业务，独立，具体功能的基础组件，比如日期选择器，模态框等。

3. 业务组件，它与独立组件的区别是，业务组件只在当前项目中会用到，不具有通用性，而且会包含一些业务，比如数据请求；而独立组件不含业务，在任何项目中都可以使用，功能单一，比如一个具有数据校验功能的输入框。

## 组件的构成

> 一个再复杂的组件，都是由三部分组成的：`prop`、`event`、`slot`，它们构成了`Vue.js` 组件的`API`。如果你开发的是一个通用组件，那一定要事先设计好这三部分。

### 属性prop

> 写通用组件时，`props`最好用**对象**的写法，这样可以针对每个属性设置类型、默认值或自定义校验属性的值，这点在组件开发中很重要，然而很多人却忽视，直接使用 `props` 的数组用法，这样的组件往往是不严谨的。

### 插槽slot

### 自定义事件event

## 组件的通信

Vue.js内置的通信手段一般有两种：

1. `ref`: 给元素或组件注册引用信息

2. `$(parent, children)`访问父,子实例.   

这两种通信手段都无法实现跨级通信，以往会借助`Vuex`或`Bus`这样都解决方案，不得不引入第三方库来支持。下面介绍一种无依赖都组件通信方法：`Vue.js`内置都`provide/inject`接口。

> 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立都时间里始终生效。

```javascript
// B是A的子组件

//A.vue

export default{
​    provide: {
​        name: 'Aresn'
​    }
}

//B.vue

export default{
​    inject: ['name'],
​    mounted () {
​        console.log(this.name)//Aresn
​    }
}
```
 - 在 A.vue 里，我们设置了一个 **provide: name** ，值为 Aresn，它的作用就是将 **name** 这个变量提供给它的所有子组件。而在 B.vue 中，通过 `inject` 注入了从 A 组件中提供的 **name** 变量，那么在组件 B 中，就可以直接通过 **this.name** 访问这个变量了，它的值也是 Aresn。这就是 provide / inject API 最核心的用法。

 - provide 和 inject 绑定并**不是可响应**的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。所以，上面 A.vue 的 name 如果改变了，B.vue 的 this.name 是不会改变的，仍然是 Aresn。

### 利用provide&inject替代Vuex

使用 Vuex，最主要的目的是跨组件通信、全局数据维护、多人协同开发。需求比如有：用户的登录信息维护、通知信息维护等全局的状态和数据。

一般在 webpack 中使用 Vue.js，都会有一个入口文件 ***\*main.js\****，里面通常导入了 Vue、VueRouter、iView 等库，通常也会导入一个入口组件 `app.vue` 作为根组件。一个简单的 app.vue 可能只有以下代码：

```javascript
<template>
 <div>
​    <router-view></router-view>
 </div>
</template>

<script>
  export default {
  }

</script>    
```

> 使用`provide/inject`替代`vuex`，就是在`app.vue`上做文章。因为你的项目中所有的组件（包含路由），它的父组件（或根组件）都是 `app.vue`，所以我们**把整个 app.vue 实例通过provide对外提供**。

```javascript
<template>
 <div>
​    <router-view></router-view>
 </div>
</template>

<script>

  export default {

​      provide() {

​          return {
​              app: this

​          }

​      }

  }

</script>    
```

> 上面代码中我们把app.vue实例this对外提供，命名为app，使用这个名字后子组件不能再使用它作为局部属性。接下来任何组件（或路由）只要通过 `inject` 注入 app.vue 的 app 的话，都可以直接通过 **this.app.xxx** 来访问 app.vue 的 `data`、`computed`、`methods` 等内容。

## 自行实现父子组件间通信的方法dispatch 和 broadcast

provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。然后有两种场景它不能很好的解决：
- 父组件向子组件（支持跨级）传递数据；
- 子组件向父组件（支持跨级）传递数据；