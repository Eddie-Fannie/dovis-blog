# 详谈js的`EventLoop`
## 引子
`JS`是单线程的，`JS`是通过事件队列（`Event Loop`）的方式来实现异步回调的。单线程的`JS`为什么拥有异步的能力，接下是从进程，线程的角度来解释这个问题。

## 进程
计算机的核心`CPU`就好像一个工厂时刻运行中，工厂的电力有限一次只能供给一个车间使用，也就是说单个`CPU`一次只能运行一个任务。

进程就好比工厂的车间，进程之间相互独立，任一时刻`CPU`总是运行一个进程，其他进程处于非运行状态。`CPU`使用时间片轮转进度算法来运行多个进程。

## 线程
一个车间里，可以有很多工人，共享车间所有的资源，共同协同完成一个任务。线程就好比车间里的工人，一个进程可以包括多个线程，多个线程共享进程资源。

## CPU，进程，线程三者关系
- 进程是`CPU`资源分配的最小单位（是能拥有资源和独立运行的最小单位）
- 线程是`CPU`调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）
- 不同进程之间也可以通信，不过代价比较大
- 单线程与多线程都是指在一个进程内的单和多

## 浏览器是多进程的
对于计算机来说，每一个应用程序都是一个进程，而每一个应用程序都会分别有很多的功能模块，这些功能模块实际上是通过子进程来实现的。对于这种子进程的扩展方式，我们可以称这个应用程序是多进程的。

对于浏览器来说，浏览器是多进程的，每一个`tab`页就是一个独立的进程。

## 浏览器包含了哪些进程
+ 主进程（浏览器进程`Browser Process`）
    + 协调控制其他子进程（创建，销毁）
    + 浏览器界面显示，用户交互，前进，后退，收藏
    + 将渲染进程得到的内存中的`Bitmap`，绘制到用户界面上
    + 处理不可见操作，网络请求，文件访问等
+ 第三方插件进程
    + 每一种类型的插件对应一个进程，仅当使用该插件时才会创建
+ `GPU`进程
    + 用于`3D`绘制等
    + 负责处理整个应用程序的`GPU`任务
+ 渲染进程，就是我们说的浏览器内核（前端操作最重要的进程）
    + 负责页面渲染，脚本执行，事件处理等
    + 每个`tab`页就是一个渲染进程

## 浏览器内核（Render进程）
该进程也同样是多线程的，包含了以下线程
+ `GUI`渲染线程
    + 负责渲染页面，布局和控制
    + 页面需要重绘和回流时，该线程就会执行
    + 与`js`引擎线程互斥，防止渲染结果不可预期。**当执行JS引擎线程时，GUI渲染会被挂起，当任务队列空闲时，JS引擎才会去执行GUI渲染。**
+ `JS`引擎线程
    + 负责处理解析和执行`js`脚本程序
    + 只有一个`JS`引擎线程（单线程）
    + 与`GUI`渲染线程互斥，防止渲染结果不可预期
+ 事件触发线程
    + 用来控制事件循环（鼠标点击，`setTimeout`，`Ajax`等）
    + 当事件满足触发条件时，将事件放入到`JS`引擎所在的执行队列中
+ 定时触发线程
    + `setInterval`和`setTimeout`所在的线程
    + 定时任务并不是由JS引擎计时的，是由定时触发线程计时的
    + 计时完毕，通知事件触发线程
+ 异步`http`请求线程
    + 浏览器有一个单独的线程用于处理`AJAX`请求
    + 当请求完成时，若有回调函数，通知事件触发线程

## 为什么GUI渲染线程和JS引擎线程互斥
这是由于JS是可以操作`DOM`的，如果同时修改元素属性并同时渲染界面，那么渲染线程前后获得的元素就可能不一致了。

当JS引擎线程执行时`GUI`渲染线程就会被挂起，`GUI`更新则会被保存在一个队列中等待JS引擎线程空闲时立即被执行。

## 从Event Loop看JS的运行机制
> 这是由一些与用户的互动以及操作 DOM 等相关的操作决定了 JS 要使用单线程，否则使用多线程会带来复杂的同步问题。如果是多线程，一个线程正在修改 DOM，另一个线程正在删除`DOM`，那么以哪一个为准呢？

**所以Js为单线程，同一时刻只能执行一个任务。当一个任务执行完成才能执行下一个任务，这样就会导致出现页面卡死的状态，页面无响应，影响用户体验，所以出现了同步和异步任务**

- JS分为同步和异步任务
::: tip
- 同步任务：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。
> 例如`console.log()`

- 异步任务：不进入主线程，而是进入“任务队列”通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。
> 例如`Ajax,DOM的事件操作，setTimeout,Promise的then,Node读取文件`
:::

1. 同步任务都在JS引擎线程上执行，形成一个执行栈
2. **事件触发线程**管理一个任务队列，异步任务触发条件达成，将回调事件放到任务队列中，等待栈为空时，依次进入栈中执行。
3. 执行栈中所有同步任务执行完毕，此时JS引擎线程空闲，系统会读取任务队列，将可运行的异步任务回调事件添加到执行栈中，开始执行

**主线程不断重复这三步**

我们知道不管是定时器还是网络请求代码，在这些代码执行时，本身是同步任务，而其中的**回调函数**才是异步任务。

当代码执行到`setTimeout/setInterval`时，实际上是JS引擎线程通知定时触发线程，间隔一个时间后，会触发一个回调事件，而定时触发线程在接收到这个消息后，会在等待的时间后，将回调事件放入到由事件触发线程所管理的事件队列中。

而当代码执行`XHR/fetch`网络请求时候，则是JS线程通知异步`http`请求线程

用代码来说话：
```javascript
let timerCallback = function(){
    console.log('wait one second')
}
let httpCallback = function(){
    console.log('get server data success')
}
//同步任务
console.log('hello')
//同步任务
//通知定时器线程JS后将timerCallback交由事件触发线程处理
//1s后事件触发线程将该事件加入到事件队列中
setTimeout(timerCallback,1000);
//同理。。。
$.get('www.xxx.com',httpCallback);
//同步任务
console.log('world')
```

总结：
- JS引擎线程只执行执行栈中的事件
- 执行栈中的代码执行完毕，就会读取事件队列中的事件
- 事件队列中的回调事件，是由各自线程插入到事件队列中的
- 如此循环

::: tip
执行栈：当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境（也叫执行上下文）。这个执行环境中存在着这个方法的私有作用域，上层作用域的指向，方法的参数，这个作用域中定义的变量以及这个作用域的`this`对象。而当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈。
:::

## 宏任务，微任务（异步任务,宏任务可以有多个，微任务队列只有一个）
当一个异步任务入栈时，主线程判断该任务为异步任务，并把该任务交给异步处理模块处理，当异步处理模块处理完打到触发条件时，根据任务的类型，将回调函数压入任务队列。

- 如果是宏任务，则新增一个宏任务队列，任务队列中的宏任务可以有多个来源。
- 如果是微任务，则直接压入微任务队列
有微任务先执行微任务，再执行宏任务。

### 什么是宏任务
我们可以将每次执行栈执行的代码当作一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行),每个宏任务会从头到尾执行完毕，不会执行其他。
浏览器为了能够使宏任务和`DOM`任务有序进行，**会在一个宏任务执行结果后，在下一个宏任务执行前，`GUI`渲染线程开始工作，对页面进行渲染。**

> 主代码块`<script>`，`setTimeout`,`setInterval`,`MessageChannel`，`postMessage`,`setImmediate`，交互事件等，都属于宏任务

**第一个例子**
```javascript
document.body.style = "background:black";
document.body.style = "background:red";
document.body.style = "background:blue";
document.body.style = "background:grey"
```
我们可以将这段代码放到浏览器的控制台执行一下，可以看到效果:
![img](/dovis-blog/other/event_loop.gif)

我们会看到页面背景在瞬间变成灰色，以上代码属于一次宏任务，所以全部执行完才会触发页面渲染，渲染时`GUI`线程会将所有的`UI`改动优化合并，所以视觉效果上，只会看到页面变成灰色。

**第二个例子**
```javascript
document.body.style="background:blue"
setTimeout(function(){
    document.body.style ="background:black"
},0)
```
![img](/dovis-blog/other/3.gif)
我们可以看到页面先变成蓝色，再瞬间变成黑色，这是因为上面代码为两次宏任务，分别执行一次然后再触发渲染，所以两种颜色都会被渲染出来。

> 如果`js`操作了`dom`，浏览器不会立即渲染，而是会将当前执行栈清空，包括`micro-task`，然后执行渲染操作，执行渲染操作

### 什么是微任务
::: tip
页面渲染事件，各种IO的完成事件等随时被添加到任务队列中，一直会保持先进先出的原则执行，我们不能准确地控制这些事件被添加到任务队列中的位置。但是这个时候突然有高优先级的任务需要尽快执行，那么一种类型的任务就不合适了，所以引入了微任务队列。
:::

我们知道宏任务结束后会执行渲染，然后执行下一个宏任务，而微任务可以理解为在当前宏任务执行后立即执行的任务。
> `Promise.then()`,`process.nextTick`,`Object.observe`，`MutationObserver`等属于微任务,在微任务中`process.nextTick`,优先级高于`Promise`，`Promise`高于`then`

**第一个例子**
```javascript
document.body.style="background:blue"
console.log(1)
Promise.resolve().then(()=>{
    console.log(2)
    document.body.style = "background:black"
});
console.log(3)
```
![img](/dovis-blog/other/4.gif)
页面的背景直接变成黑色，没有经过蓝色的阶段，是因为，我们在宏任务中将背景设置为蓝色，但在进行渲染前执行了微任务，在微任务中将背景变成黑色，然后才执行的渲染

**第二个例子**
```javascript
setTimeout(()=>{
    console.log(1)
    Promise.resolve(3).then(data => console.log(data))
},0)
setTimeout(() => {
    console.log(2)
},0)
```
上面代码共有两个`setTimeout`，也就是说除主代码外，共有两个宏任务，其中第一个宏任务执行中，输出`1`，并且创建微任务队列，**所以在下一个宏任务队列执行前，先执行微任务**，在微任务执行中输出`3`，微任务执行后，执行下次宏任务，执行中输出`2`.

**当异步任务进入栈执行时，微任务和宏任务并排进入执行队列时，先执行微任务**
```javascript
setTimeout(function(){
    console.log(1)
    Promise.resolve().then(function () {
        console.log(2)
    })
},0)
setTimeout(function () {
    console.log(3)
},0)
Promise.resolve().then(function () {
    console.log(4)
})
console.log(5)//5，4，1，2，3
```
+ 第一轮循环
    - 同样从全局任务入口，遇到宏任务`setTimeout`，交给异步处理模块，我们暂且记为`setTimeout 1`，由于等待时间为0，直接加入宏任务队列。
    - 再次遇到宏任务`setTimeout`，交给异步处理模块，我们暂且记为`setTimeout2`,同样直接加入宏任务队列
    - 遇到微任务`then()`，加入微任务队列。
    - 直接打印日志`5`，所以先输出`5`
+ 第二轮循环
    - 栈空后，先执行微任务队列，输出`4`
    - 读取宏任务队列最靠前的任务`setTimeout1`
    - 先直接执行打印语句，打印日志`1`，又遇到微任务`then()`,加入微任务队列，第二轮循环结束
+ 第三轮循环
    - 先执行微任务队列中的`then()`,输出`2`
    - 执行`setTimeout2`，输出`3`，执行完毕
----
**此文章非原创，经总结他人博客内容，仅供自己学习前端，无商业用途。以下为博客参考来源：**
1.云中桥的《从多线程来看Event Loop》<https://github.com/chenqf/frontEndBlog/issues/14>

## 附加例子：
```js
console.log(1)
setTimeout(() => {
    console.log(2)
}, 1000)
new Promise((resolve, reject) => {
    console.log(3)
    resolve()
    console.log(4)
}).then(() => {
    console.log(5)
})
console.log(6)
```
::: tip
+ 上述例子分析：
    - 初始化状态，执行栈为空
    - 首先执行`script`标签内的同步代码，此时全局的代码进入执行栈，同步顺序执行代码，输出`1`
    - 执行过程中遇到异步代码`setTimeout`（宏任务），将其分配到宏任务异步队列中。
    - 同步代码继续执行，遇到一个`Promise`异步代码（微任务）。但是构造函数中的代码为同步代码，依次输出`3`和`4`，则`then`之后的任务加入到微任务队列中去。
    - 最后执行同步代码，输出`6`
    - 因为`script`内的代码作为宏任务处理，所以此次循环进行到处理微任务队列中的所有异步任务，直到微任务队列中所有任务执行完成为止，微任务队列中只有一个微任务，所以输出`5`
    - 此时页面要进行一次**页面渲染**，渲染完成之后，进行下一次循环
    - 在宏任务队列中取出一个宏任务，也就是之前的`setTimeout`，输出`2`（**可以看成是在下一轮事件循环开始时执行**）
    - 此时任务队列为空，执行栈为空，整个程序执行完毕。
:::

## 宏任务微任务运行机制总结
异步任务的返回结果会被放到一个任务队列中，根据异步事件的类型，这个事件实际上会被放到对应的宏任务和微任务队列中去。在当前执行栈为空时，主线程会查看微任务队列是否有事件存在：
- 存在，依次执行队列中的事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的事件，把当前的回调加到当前指向栈。
- 如果不存在，那么再去宏任务队列中取出一个事件把对应的回调加入当前执行栈。

当前执行栈执行完毕后时会立刻处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。

在事件循环中，每进行一次循环操作称为 `tick`，每一次 `tick` 的任务处理模型是比较复杂的，但关键步骤如下：
- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后`GUI`线程接管渲染

::: tip
进入更新渲染阶段，判断是否需要渲染，这里有一个 `rendering opportunity` 的概念，也就是说不一定每一轮 `event loop` 都会对应一次浏览器渲染，要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定，通常来说这个渲染间隔是固定的。（所以多个 `task` 很可能在一次渲染之间执行）

- 浏览器会尽可能的保持帧率稳定，例如页面性能无法维持 `60fps`（每 `16.66ms` 渲染一次）的话，那么浏览器就会选择 `30fps` 的更新速率，而不是偶尔丢帧。
- 如果浏览器上下文不可见，那么页面会降低到 `4fps` 左右甚至更低。
- 如果满足以下条件，也会跳过渲染：
    + 浏览器判断更新渲染不会带来视觉上的改变。
    + `map of animation frame callbacks` 为空，也就是帧动画回调为空，可以通过`requestAnimationFrame` 来请求帧动画。
:::

- 渲染完毕后，`JS`线程继续接管，开始下一个宏任务（从事件队列中获取）

简单总结一下执行的顺序：执行宏任务，然后执行该宏任务产生的微任务，若微任务在执行过程中产生了新的微任务，则继续执行微任务，微任务执行完毕后，再回到宏任务中进行下一轮循环。

## 经典面试题分析
1. `async await`
```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```

![img](/dovis-blog/other/48.png)

2. `setTimeout Promise`
```js
console.log('start');
setTimeout(() => {
    console.log('children2');
    Promise.resolve().then(() => {
        console.log('children3');
    })
}, 0);

new Promise(function(resolve, reject) {
    console.log('children4');
    setTimeout(function() {
        console.log('children5');
        resolve('children6')
    }, 0)
}).then((res) => {
    console.log('children7');
    setTimeout(() => {
        console.log(res);
    }, 0)
})
```
![img](/dovis-blog/other/49.png)

::: tip
这题在`node 10.8`环境下答案为`start children4 2 5 3 7 6`
:::

3. `Promise`立即执行
```js
const p = function() {
    return new Promise((resolve, reject) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
            }, 0)
            resolve(2)
        })
        p1.then((res) => {
            console.log(res);
        })
        console.log(3);
        resolve(4);
    })
}


p().then((res) => {
    console.log(res);
})
console.log('end');
```

![img](/dovis-blog/other/50.png)

4. 黄金题
```js
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  })
  new Promise((resolve) => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5')
  })
})

Promise.reject().then(() => {
  console.log('13');
}, () => {
  console.log('12');
})

new Promise((resolve) => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8')
})

setTimeout(() => {
  console.log('9');
  Promise.resolve().then(() => {
    console.log('10');
  })
  new Promise((resolve) => {
    console.log('11');
    resolve();
  }).then(() => {
    console.log('12')
  })
})
```
> `1 7 12 8 2 4 3 5 9 11 10 12`

::: tip
这题在`node 10.8`环境下答案为`1 7 12 8 2 4 9 11 3 5 10 12`
:::

5. 钻石题
```js
new Promise((resolve, reject) => {
    console.log(1)
    resolve()
  })
  .then(() => {
    console.log(2)
    new Promise((resolve, reject) => {
        console.log(3)
        setTimeout(() => {
          reject();
        }, 3 * 1000);
        resolve()
    })
      .then(() => {
        console.log(4)
        new Promise((resolve, reject) => {
            console.log(5)
            resolve();
          })
          .then(() => {
            console.log(7)
          })
          .then(() => {
            console.log(9)
          })
      })
      .then(() => {
        console.log(8)
      })
  })
  .then(() => {
    console.log(6)
  })
```
> `1 2 3 4 5 6 7 8 9`

6. 王者题
```js
Promise.resolve()
  .then(() => {
    console.log('promise1');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('timer2')
          resolve()
        }, 0)
    })
      .then(async () => {
        await foo();
        return new Error('error1')
      })
      .then((ret) => {
        setTimeout(() => {
          console.log(ret);
          Promise.resolve()
          .then(() => {
            return new Error('error!!!')
          })
          .then(res => {
            console.log("then: ", res)
          })
          .catch(err => {
            console.log("catch: ", err)
          })
        }, 1 * 3000)
      }, err => {
        console.log(err);
      })
      .finally((res) => {
        console.log(res);
        throw new Error('error2')
      })
      .then((res) => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  })
  .then(() => {
    console.log('promise2');
  })

function foo() {
  setTimeout(() => { 
    console.log('async1');
  }, 2 * 1000);
}

setTimeout(() => {
  console.log('timer1')
  Promise.resolve()
    .then(() => {
      console.log('promise3')
    })
}, 0)

console.log('start');
```
![img](/dovis-blog/other/51.png)

7. 荣耀王者
```js
async function async1() {
  console.log('async1 start');
  new Promise((resolve, reject) => {
    try {
      throw new Error('error1')
    } catch(e) {
      console.log(e);
    }
    setTimeout(() => { // 宏3
      resolve('promise4')
    }, 3 * 1000);
  })
    .then((res) => { // 微3-1
      console.log(res);
    }, err => {
      console.log(err);
    })
    .finally(res => { // 微3-2 // TODO注3
      console.log(res);
    })
  console.log(await async2()); // TODO-注1
  console.log('async1 end'); // 微1-1 // TODO-注2
}

function async2() {
  console.log('async2');
  return new Promise((resolve) => {
    setTimeout(() => { // 宏4
      resolve(2)
    }, 1 * 3000);
  })
}

console.log('script start');

setTimeout(() => { // 宏2
  console.log('setTimeout');
}, 0)

async1();

new Promise((resolve) => {
  console.log('promise1');
  resolve();
})
  .then(() => { // 微1-2
    console.log('promise2');
    return new Promise((resolve) => {
      resolve()
    })
      .then(() => { // 微1-3
        console.log('then 1-1')
      })
  })
  .then(() => { // 微1-4
    console.log('promise3');
  })


console.log('script end');
```
![img](/dovis-blog/other/52.png)

8. 逆天王者
```js
console.log('script start');

setTimeout(() => {
  console.log('Gopal');
}, 1 * 2000);

Promise.resolve()
.then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});


async function foo() {
  await bar()
  console.log('async1 end')
}
foo()

async function errorFunc () {
  try {
    // Tips:参考：https://zh.javascript.info/promise-error-handling：隐式 try…catch
    // Promise.reject()方法返回一个带有拒绝原因的Promise对象
    // Promise.reject('error!!!') === new Error('error!!!')
    await Promise.reject('error!!!')
  } catch(e) { // try中的错误也可以捕获到的
    console.log(e) // error!!!
  }
  console.log('async1');
  return Promise.resolve('async1 success')
}
errorFunc().then(res => console.log(res)) //'async1 success'

function bar() {
  console.log('async2 end') 
}

console.log('script end');
```
> 输出`script start`->`async2 end`->`script end`->`promise1`->`async1 end`->`error!!!`->`async1`->`promise2`->`async1 success`->`Gopal`
::: tip
为了优化`promise`的`then`链写法，用同步的方式编写异步代码，让代码看起来更简洁明了 `await`的真实意思是 `async await`(异步等待的意思) `await`表达式相当于调用后面返回`promise`的`then`方法，异步（等待）获取其返回值。即 `await<==>promise.then`
:::

9. 
```js
let resolvePromise = new Promise(resolve => {
  let resolvedPromise = Promise.resolve()
  resolve(resolvedPromise);
  // 提示：resolve(resolvedPromise) 等同于：
  // Promise.resolve().then(() => resolvedPromise.then(resolve));
})
resolvePromise.then(() => {
  console.log('resolvePromise resolved')
})
let resolvedPromiseThen = Promise.resolve().then(res => {
  console.log('promise1')
})
resolvedPromiseThen
  .then(() => {
    console.log('promise2')
  })
  .then(() => {
    console.log('promise3')
  })
```
> `promise1`->`promise2`->`resolvePromise resolved`->`promise3`

10. 
```js
setTimeout(() => {
  console.log('timeout1')
},0)
setTimeout(() => {
  console.log('timeout2')
  Promise.resolve().then(function(){
    console.log('promise1')
  })
},0)
setTimeout(() => {
  console.log('timeout3')
},0)
```
>在浏览器环境&`node11`下结果：`timeout1 timeout2 promise1 timeout3`。在`node10.8`环境下为`timeout1 timeout2 timeout3 promise1`

## Node中的Event Loop
> `Node` 的 `Event Loop` 分为 `6` 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

### `timer`
`timers`阶段会执行`setTimeout/setInterval`回调，并且是由`poll`阶段控制的。同样，在`Node`中定时器指定的时间也不是准确时间，只能是尽快执行。

### `I/O`
`I/O`阶段会处理一些上一轮循环中的少数未执行的`I/O`回调

### `idle,prepare`
### `poll`
`poll`是一个至关重要的阶段，这一阶段中，系统会做两件事情：
- 回到`timer`阶段执行回调
- 执行`I/O`回调

并且在进入该阶段时如果没有设定了 `timer` 的话，会发生以下两件事情：

1. 如果 `poll` 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
2. 如果 `poll` 队列为空时，会有两件事发生
  - 如果有 `setImmediate` 回调需要执行，`poll` 阶段会停止并且进入到 `check` 阶段执行回调
  - 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
当然设定了 `timer` 的话且 `poll` 队列为空，则会判断是否有 `timer` 超时，如果有的话会回到 `timer` 阶段执行回调。

### `check`
`check`阶段执行`setImmediate`
> `setImmediate`；该方法用来把一些需要长时间运行的操作放在一个回调函数里,在浏览器完成后面的其他语句后,就立刻执行这个回调函数。该方法可以用来替代 `setTimeout(fn,0)` 方法来滞后完成一些需要占用大量cpu时间的操作。

```js
// 用来兼容那些不支持setImmediate方法的浏览器:
if (!window.setImmediate) {
  window.setImmediate = function(func, args){
    return window.setTimeout(func, 0, args);
  };
  window.clearImmediate = window.clearTimeout;
}
```

### `close callbacks`
`close callbacks`阶段执行`close`事件。比如`socket.on('close',...)`就会在这个阶段触发

::: tip
`Node v11.0`之前的事件循环机制：
- 执行全局的`Script`代码（与浏览器无差）
- 把微任务队列清空：注意，`Node`清空微任务队列的手法比较特别。在浏览器中，我们只有一个微任务队列需要接受处理；但在`Node`中，有两类微任务队列：`next-tick`队列和其他队列。其中前者队列用来专门收敛`process.nextTick`派发的异步任务。在清空队列时，优先清空`next-tick`队列中的任务，随后才会清空其他微任务；
- 开始执行宏任务。注意，`Node`执行宏任务的方式和浏览器不同：在浏览器中，我们每次出队并执行一个宏任务；而在`Node`中，我们每次会尝试清空当前阶段对应宏任务队列里面的所有认为。
- 步骤`3`开始会进入`3->2->3->2`的循环。

`Node11`事件循环已经和浏览器的趋同
> `node11`开始，`timers`阶段的`setTimeout/setInterval`等函数派发任务，包括`setImmediate`派发的任务，都被修改为：一旦执行完当前阶段的一个任务，就立刻执行微任务队列。
:::

## `Node`的`Event Loop`题目
1. `nextTick和Promise.then`
```js
Promise.resolve().then(function() {
  console.log('promsie')
}).then(function() {
  console.log('promise2')
})

process.nextTick(() => {
  console.log('nextTick1')
  process.nextTick(() => {
    console.log('nextTick2')
    process.nextTick(() => {
      console.log('nextTick3')
      process.nextTick(() => {
        console.log('nextTick4')
      })
    })
  })
})

//nextTick1,nextTick2,nextTick3,nextTick4,promise1,promise2
```
>不管是什么微任务，全部都要排在`process.nextTick`后面执行。