# 一些常见api的实现
## 利用setTimeout实现setInterval

```js
function mySetInterval() {
    mySetInterval.timer = setTimeout(() => {
        arguments[0]()
        mySetInterval(...arguments)
    }, arguments[1])
}

mySetInterval.clear = function() {
    clearTimeout(mySetInterval.timer)
}

mySetInterval(() => {
    console.log(11111)
}, 1000)

setTimeout(() => {
    // 5s 后清理
    mySetInterval.clear()
}, 5000)
```

## 实现`indexOf`
```js
function indexOf(arr,target,start=0){
     if(start<0) start+=arr.length;
     if(start>=arr.length) return -1;
     for(let i=start;i<arr.length;++i){
        if(arr[i]===target) return i;
  }
  return -1;
}
```
> 考察第二个参数从哪里开始查找的使用

## 实现`reduce`
```js
Array.prototype.myReduce = function (callback,initvalue) {
    let arr = this
    let base = typeof initvalue === 'undefined' ? arr[0] : initvalue
    let startPoint = typeof initvalue === 'undefined' ? 1 : 0
    for(let i=startPoint;i<arr.length;i++) {
        base = callback(base,arr[i],i,arr)
    }
    return base
}
```

## `reduce`实现`runPromiseSequence
```js
const f1 = () => new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log('p1 running')
        resolve(1)
    },1000)
})
const f2 = () => new Promise((resolve,rejct) => {
    setTimeout(() => {
        console.log('p2 running')
        resolve(2)
    },1000)
})
const array = [f1,f2]

const runPromiseInSequence = (array, value) => array.reduce(
    (promiseChain,currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(value)
)
runPromiseInSequence(array,'init')
```

## `reduce`实现`pipe`
`pipe(f,g,h)`是一个柯里化函数，它返回一个新的函数，这个新的函数会完成`(...args) => h(g(f(...args)))`的调用，即`pipe`方法返回的函数会接收一个参数，这个参数将会作为数组`functions`的`reduce`方法的初始值

```js
const pipe = (...functions) => input => function.reduce(
    (acc,fn) => fn(acc),
    input
)
```

## 实现`map`
```js
Array.prototype.newMap = function(fn) {
　　var newArr = [];
　　for(var i = 0; i<this.length; i++){
　　　　newArr.push(fn(this[i],i,this))
　　}
　　return newArr;
}
```

## 实现一个js调度器
```js
class Scheduler {
    constructor(num) {
        this.num = num, // 允许运行时函数的最大个数
        this.list = [], // 用来承载还未执行的异步
        this.count = 0 // 用来计数
    }
    async add (fn) {
        if (this.count >= this.num) {
          // 通过 await 阻塞 Promise 但是又不执行 resolve ,
          // 而是将 resolve 保存到数组当中去,
          // 这样就达到了当异步任务超过 max 个时线程就会阻塞在第一行.
    
          await new Promise((resolve) => { this.list.push(resolve) })
        }
        this.count++
        const result = await fn()
        if (this.list.length > 0) {
          // 每执行完一个异步任务就会去数组中查看一下有没有还处于阻塞当中的异步任务,
          // 如果有的话就执行最前面的那个异步任务.
          this.list.shift()()
        }
        return result
      }
}

const schedule = new Scheduler(2) // 最多同一时间执行两个异步函数
const timeout = (time) => new Promise(resolve => setTimeout(resolve,time))

const addTask = (time, order) => {
    schedule.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000,1)
addTask(500,2)
addTask(300,3)
addTask(400,4)
console.dir(schedule, 3)
// output: 2,3,1,4
// 一开始1、2 两个任务进入队列
// 500ms 时，2完成，输出2，任务3进队
// 800ms 时，3完成，输出3，任务4进队
// 1000ms 时， 1完成
// 1200ms 时，4完成
```