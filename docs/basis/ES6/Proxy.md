# Proxy
## 什么是Proxy
> `Proxy`用于修改某些操作的默认行为，可以理解成在目标对象前假设一个拦截层，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制可以对外界的访问进行过滤和改写。

生成一个`Proxy`实例；`target`表示所要拦截的目标对象，`handler`也是一个对象用来定制拦截行为。
```js
var proxy = new Proxy(target, handler);
```
例子：
```js
var proxy = new Proxy({}, {
  get: function(target,property) {
      return 35
  }
})
proxy.time // 35

const person = {
    name:'tom'
}
const proxy = new Proxy(person,{
    get(target,prop) {
        console.log(`${prop} is ${target[prop]}`)
        return target[prop]
    }
})
console.log(proxy.name) // tom
console.log(person === proxy) // false
```
> 如果没有`Proxy`介入，操作就是要访问目标对象的。第二个参数为配置对象，`get`方法用来拦截对目标对象属性的访问请求。该方法同样也有两个参数，`target`代表则目标对象，`property`表示所要访问的属性。可以看到由于拦截函数总是返回`35`，所以访问任何属性都将得到`35`。

> 要想`Proxy`起作用，要针对`Proxy`实例进行操作才行。如果配置对象没有设置任何拦截，则**等同于直通目标原对象**

## Proxy实例的方法（设置拦截多个操作）
- `get(target, propKey, receiver)`
> 拦截对象属性的读取，最后一个参数可选（参考`Reflect.get`）
+ 例子
    - `get`方法可以继承
    ```js
    let proto = new Proxy({}, {
        get(target, propertyKey,receiver) {
            console.log('GET'+propertyKey);
            return target[propertyKey]
        }
    })
    let obj = Object.create(proto)
    obj.xxx // "GET xxx"
    ```
    - 如果一个属性不可配置或不可写，则该属性不能被代理。通过`Proxy`访问该属性就会报错。
    ```js
    const target = Object.defineProperties({},{
        foo: {
            value: 123,
            writable: false,
            configurable: false
        }
    });
    const handler = {
        get(target, propKey) {
            return 'abc'
        }
    }
    const proxy = new Proxy(target, handler)
    proxy.foo // TypeError: Invariant check failed
    ```

```js
var person = {
  name: '张三'
}
var proxy = new Proxy(person,{
  get: function(target, property) {
    if(property in target) {
      return target[property]
    } else {
      throw new ReferenceError('...')
    }
  }
})
proxy.name // 张三
proxy.age // 报错
// 如果没有这个拦截函数，访问不存在的属性只会返回undefined

// get方法可以继承
```

- `set(target,propKey,value,receiver)`
> 拦截对象属性的设置，返回一个布尔值

**`Proxy`来实现数据响应**
```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```

- `has(target, propKey)`
> 拦截`propKey in proxy`的操作，返回一个布尔值

- `deleteProperty(target,prokey)`
> 拦截`delete proxy[propKey]`的操作，返回一个布尔值

- `ownKeys(target)`
> 该方法返回目标对象所有自身属性的属性名。

- `getOwnPropertyDescriptor(target, propKey)`
> 拦截`Object.getOwnPropertyDescriptor(proxy,propKey)`，返回属性的描述对象。

- `defineProperty(target,propKey,propDesc)`
> 拦截`Object.defineProperty(proxy,propKey,propDesc)`,`Object.defineProperties(proxy,propDescs)`返回要给布尔值。

- `apply(target,object,args)`
> 拦截Proxy实例，并将其作为函数调用的操作。

**三个参数分别是目标对象，目标对象的上下文对象，目标对象的参数数组**

- `construct(target, args)`
> 拦截Proxy实例作为构造函数调用的操作。比如`new Proxy(...args)`

## `Object.defineProperty` vs `Proxy`的区别
- `Object.defineProperty`无法一次性监听所有属性，必须遍历或者递归来实现。

```js
const person = {
  name:'tom',
  age: 22
}

Object.defineProperty(person, 'name',{
  get() {
      return value
  },
  set(newVal) {
      value = newVal
  }
})
person.name = 'linjiaheng'

// 多个属性
let girl = {
  name: "marry",
  age: 22
}
/* Proxy 监听整个对象*/
girl = new Proxy(girl, {
  get() {}
  set() {}
})
/* Object.defineProperty */
Object.keys(girl).forEach(key => {
  Object.defineProperty(girl, key, {
    set() {},
    get() {}
  })
})
```
- `Object.defineProperty`无法监听新增加的属性，需要手动再去做一次监听。
- `Object.defineProperty`可以监听数组的变化，却无法对`push/shift/pop/unshift`等方法进行响应。对于新增的数组项监听不到。