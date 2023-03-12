# 深入浅出 VueRouter 原理

## install 方法
作为vue插件，为了`Vue.use` 函数可以用，作为vue插件必须含有`install`方法

![img](/dovis-blog/other/89.png)

1. `install`的第一个参数就是Vue构造函数，`install`的主要作用就是为了每个`vue`实例全局注册`router`和`route`对象。并且在内部实现全局的`RouterView`和`RouteLink`组件
2. 通过 `Vue.mixin()` 将`mixin`里面的内容全局混入到每个`vue`实例对象上的 `options` 里面
3. `beforeCreate`确保在 `vue`实例对象 `options`初始化没完成前注入 `mixin`里面的内容
4. `this.$options.router` 可以用来判断是否为根组件，只有根组件的`options`里面才会有`router`参数
5. 如果不是根组件，找其父组件的`_routerRoot`。因为父组件的`beforeCreate`先执行。因此可以确保子组件的`beforeCreate`生命周期函数里面可以拿到父组件的`_routerRoot`
6. 为`Vue`添加`$router`，`$route`

::: tip
- 当用户执行 `Vue.use(VueRouter)` 的时候，实际上就是在执行 `install` 函数，为了确保 `install` 逻辑只执行一次，用了 `install.installed` 变量做已安装的标志位。另外用一个全局的 `_Vue` 来接收参数 `Vue`，因为作为 `Vue` 的插件对 `Vue` 对象是有依赖的，但又不能去单独去 `import Vue`，因为那样会增加包体积，所以就通过这种方式拿到 `Vue` 对象。
- `mixin`的 `beforeCreate` 钩子函数，对于根 `Vue` 实例而言，执行该钩子函数时定义了 `this._routerRoot` 表示它自身；`this._router` 表示 `VueRouter` 的实例 `router` ，它是在 `new Vue` 的时候传入的；另外执行了 `this._router.init()` 方法初始化 `router` 。然后用 `defineReactive` 方法把 `this._route `变成响应式对象。
- **而对于子组件而言，由于组件是树状结构，在遍历组件树的过程中，它们在执行该钩子函数的时候 `this._routerRoot` 始终指向的离它最近的传入了 `router` 对象作为配置而实例化的父实例。**
- 接着给 `Vue` 原型上定义了 `$router` 和 `$route` `2` 个属性的 `get` 方法，这就是为什么我们可以在组件实例上可以访问 `this.$router` 以及 `this.$route`
:::

## new VueRouter 做了哪些事情
```js
constructor (options: RouterOptions = {}) {
  if (process.env.NODE_ENV !== 'production') {
    warn(this instanceof VueRouter, `Router must be called with the new operator.`)
  }
  this.app = null
  this.apps = []
  this.options = options
  this.beforeHooks = []
  this.resolveHooks = []
  this.afterHooks = []
  this.matcher = createMatcher(options.routes || [], this)

  let mode = options.mode || 'hash'
  this.fallback =
    mode === 'history' && !supportsPushState && options.fallback !== false
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base)
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `invalid mode: ${mode}`)
      }
  }
}
```
:::tip
1. 构造函数定义了一些属性，其中 `this.app` 表示根 `Vue` 实例，`this.apps` 保存持有 `$options.router` 属性的 `Vue` 实例，`this.options` 保存传入的路由配置，`this.beforeHooks`、 `this.resolveHooks`、`this.afterHooks` 表示一些钩子函数
2. `this.matcher` 表示路由匹配器
3. `this.fallback` 表示在浏览器不支持 `history.pushState` 的情况下，根据传入的 `fallback` 配置参数，决定是否回退到 `hash` 模式
4. `this.mode` 表示路由创建的模式，`this.history` 表示路由历史的具体的实现实例，它是根据 `this.mode` 的不同实现不同，它有 `History` 基类，然后不同的 `history` 实现都是继承 `History`。
:::

## RouterView组件
![img](/dovis-blog/other/90.png)

1. 用 `parent` 的`createElement`用来渲染组件
2. `depth` 路由嵌套层级
3. `const matched = route.matched[depth]` 根据路由嵌套层级获取到匹配到需要渲染的组件对象
4. `const component = cache[name] = matched.components[name]` 需要渲染的组件
5. `h(component, data, children)` 渲染组件

`RouterView`本质上为通过`this.$route`获取当前激活的路由。并通过路由配置获取当前激活路由对应的组件进行渲染。

## RouterLink 组件
`RouterLink`本质将其渲染成a标签进行渲染

## 路由模式
### `hash`模式
路由主要包括`hash`/`history`模式，还有一个`Node`环境下使用的`abstract`模式

```js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    super(router, base)
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash()
  }
}

function checkFallback (base) {
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location))
    return true
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}
export function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path))
  } else {
    window.location.replace(getUrl(path))
  }
}
```
1. `fallback`：当浏览器不支持 `history.pushState` 控制路由是否应该回退到 `hash` 模式。默认值为 `true`。
2. 通过`checkFallback`检测本来为`history`但是需要被转换成`hash`模式的情况
3. `getHash`返回`#`后面的`hash`部分。`replaceHash`如果`path`后面没有`/`则自动进行追加
4. `hash`模式通过监听`hashchange`事件实现视图更新，对于支持`history`模式的则监听`popstate`事件实现视图更新

![img](/dovis-blog/other/91.png)

### `history`模式
通过监听`popstate`