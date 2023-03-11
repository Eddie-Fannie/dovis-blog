# Node基础知识

## __filename变量与__dirname变量
> 在`Node.js`中，预定义了两个变量：用于获取当前模块文件名的`__filename`变量与用于获取当前目录名的`__dirname`变量。

## EventEmitter 类
> 在`Node.js`的用于实现各种事件处理的`event`模块中，定义了一个`EventEmitter`类。所有可能触发事件的对象都是一个继承了`EventEmitter`类的子类的实例对象，在`Node.js`中，为`EventEmitter`类定义了许多方法，所有与对象的事件处理函数的绑定及解除相关的处理均依靠这些方法的调用来执行。

当需要对指定事件绑定事件处理函数时，可以使用`EventEmitter`类的`on`方法或`addListener`方法。这两个方法的区别仅在于方法名而已，内部实现同样的处理。

```js
emitter.on(event, listener)
emitter.addListener(event, listener)
```
> 这两个方法均使用两个参数，其中第一个参数为指定事件名，第二个参数为该事件的事件处理函数。在默认情况下，针对同一个指定事件，最多可以绑定`10`个事件处理函数。可以通过`setMaxListeners`方法修改最多可以绑定的事件处理函数数量

```js
emitter.setMaxListeners(n)
```

> 当需要取得一个指定事件的所有事件处理函数时，可以使用`listeners`方法，`listeners`方法使用一个参数，参数值为指定事件名。该方法返回由该事件的所有事件处理函数构成的数组。

> `EventEmitter`类的`once`方法与`on`方法类似，作用均为对指定事件绑定事件处理函数，区别在于，当事件处理函数执行一次后立即被解除，即该事件处理函数只会被执行一次。

> 当需要对某个事件解除某个事件处理函数时，可以使用`EventEmitter`类的`removeListener`方法。可以使用`EventEmitter`类的`removeAllListeners`方法取消某个事件的所有已被指定事件处理函数或所有已被指定的事件处理函数。**在`removeAllListeners`方法中，可以使用一个参数，参数值为需要被解除事件处理函数的事件名。如果在`removeAllListeners`方法中使用事件名参数时，将取消该事件的所有事件处理函数；如果在`removeAllListeners`方法中不使用事件名参数时，将取消所有已被指定的事件。**
```js
emitter.removeListener(event, listener)

emitter.removeAllListeners([event])
```

> 当你需要手工触发某个对象的一个事件时，可以使用`EventEmitter`类的`emit`方法。在`emit`方法中可以使用一个或多个参数，其中第一个参数值为需要手工触发的事件名，从第二个参数开始为需要传递给事件处理函数的参数。

```js
emitter.emit(event, [arg1], [arg2], [...])
```

> `EventEmitter`类自身拥有一个`listenerCount`方法，可用来获取某个对象的指定事件的事件处理函数的数量。**在`listenerCount`方法中，使用两个参数，其中第一个参数用于指定需要获取哪个对象的事件处理函数的数量，第二个参数用于指定需要获取哪个事件的事件处理函数的数量。**

```js
EventEmitter.listenerCount(emitter, event)
```

> 在`events`模块中，为`EventEmitter`类本身定义了两个事件：`newListener`事件与`removeListener`事件。任何时候，当对继承了`EventEmitter`类的子类实例对象绑定事件处理函数时，都将触发`EventEmitter`类的`newListener`事件。任何时候，当对继承了`EventEmitter`类的子类实例对象取消事件处理函数时，都将触发`EventEmitter`类的`removeListener`事件

```js
emitter.on('newListener',function(e,f){
// 事件处理函数代码
});

emitter.on('removeListener',function(e,f){
// 事件处理函数代码
});
```

### 事件环机制
> 在`Node.js`中，采用非阻塞型`I/O`机制，这意味着所有要求应用程序所进行的处理，如`HTTP`请求、数据库查询、文件的输入/输出等，都不会在处理结束之前阻碍其他处理的进行，也就是说，这些处理都是独立进行的，当处理结束时，会触发一个回调事件，也就是说，在`Node.js`中，我们所要编写的是各种`I/O`事件的回调函数中的处理。

## 使用`Buffer`类处理二进制数据
> 在处理`TCP`流或文件流时，必须要处理二进制数据。因此，在`Node.js`中，定义了一个`Buffer`类，该类用来创建一个专门存放二进制数据的缓存区。