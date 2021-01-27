# 手写一些Vue的代码
## 实现一个Vue的响应式原理
```js
// 实现被观察者类，就是收集依赖的
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify(data) {
        this.subs.forEach(sub => sub.update(data))
    }
}

// 实现观察者类
class Watcher {
    constructor(cb){
        this.cb =cb
    }
    update(data) {
        this.cb(data)
    }
}
```
- `Dep` 被观察者类，提供用来收集观察者（ `addSub` ）方法和通知观察者（ `notify` ）方法；
- `Watcher` 观察者类，实例化时支持传入回调（ `cb` ）方法，并提供更新（ `update` ）方法；

```js
// 实现响应式类
class Observer {
    constructor(node,data) {
        this.defineReactive(node,data)
    }
    defineReactive(vm,obj) {
        for(let key in obj) {
            let value = obj[key],dep=new Dep()
            Object.defineProperty(obj,key,{
                enumerable: true,
                configurable: true,
                get() {
                    let watcher = new Watcher(v => vm.innerText = v)
                    dep.addSub(watcher)
                    return value
                },
                set(newValue) {
                    value = newValue
                    //通知观察者
                    dep.notify(newValue)
                }
            })
        }
    }
}

// 例子
let initData = {
    text: '你好，前端自习课',
    desc: '每日清晨，享受一篇前端优秀文章。'
};

const app = document.querySelector('#app');

// 步骤1：为测试数据转换为响应式对象
new Observer(app, initData);

// 步骤2：初始化页面文本内容
app.innerText = initData.text;

// 步骤3：绑定按钮事件，点击触发测试
document.querySelector('#update').addEventListener('click', function(){
    initData.text = `我们必须经常保持旧的记忆和新的希望。`;
    console.log(`当前时间：${new Date().toLocaleString()}`)
})
```