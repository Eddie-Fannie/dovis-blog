# 实现一个事件总线EventEmitter(发布订阅)
[vue中事件相关的实例方法](/frame/Vue/vue的api原理.html#事件相关的实例方法)

```js
class EventEmitter {
  constructor() {
    this.eventHub = {}
  }
  on(eventName,fn) {
    let events = this.eventHub[eventName] || []
    events.push(fn)
    this.eventHub[eventName] = events
    return this;
  }
  off(eventName,fn) {
    if(!arguments.length) {
      // 没有传参数时清空所有事件监听器
      this.eventHub = Object.create(null)
      return this
    }
    
    // 只提供事件时
    const cbs = this.eventHub[eventName]
    if(!cbs) return this
    if(arguments.length === 1) {
      this.eventHub[eventName] = null
      return this
    }
    
    // 只移除和fn相同的监听器
    if(fn) {
      const cbs = this.eventHub[eventName]
      let cb
      let i = cbs.length
      while(i--) {
        cb = cbs[i]
        if(cb === fn || cb.fn === fn) {
          cbs.splice(i,1)
          break
        }
      }
    }
    return this
  }
  once(eventName,fn) {
    let wrapFun = (...args) => {
      
      this.off(eventName,wrapFun)
      fn.apply(this,args)
    }
    wrapFun.fn = fn
    this.on(eventName,wrapFun)
    return this
  }
  emit(eventName, ...args) {
    let events = this.eventHub[eventName] || []
    events.forEach(event => {
      typeof event === 'function' && event.apply(this,args)
    });
    return this
  }
}

function test(...args) {
  console.log(args)
}

function test2(name) {
  console.log(name)
}

function test3(str) {
  console.log(str)
}

let event = new EventEmitter()
event.on("test", test);
event.emit("test", 1,2,3);

event.on("test2", test2);
// event.off('test2',test2)
event.emit("test2", 'linjiaheng');


event.once("test3", test3);// hhh
event.off('test3',test3) // 移除失效，因为test3和wrapFun不一致，所以要补充wrapFun.fn = fn

event.emit("test3", 'hhh');

console.log(event)
```