# JavaScript的错误处理和调试
> `try catch`处理异常能力有限，对于处理运行时非异步错误是没有问题的，但却无法处理语法错误和异步错误。

```js
try {
    // 可能会导致错误的代码
} catch(error) {
    // 在错误发生时怎么处理
    alert(error.message)
} finally {
    return 0
}
```
> 如果`try`块中的任何代码发生错误，就会立即退出代码执行过程，然后接着执行`catch`块，此时`catch`块会接收到一个包含错误信息的对象。无论如何是直接执行完`try`语句还是跳出执行`catch`语句，`finally`语句都会执行。

## 错误类型
- `Error`
> 基本类型，其他错误类型都继承该类型。该错误类型很少见，一般供开发人员自定义错误。

- `EvalError`
> 使用`eval()`函数发生异常时被抛出。如果没有把`eval()`当成函数调用就会报该错误类型。

- `RangeError`
> 数值超出相应范围时触发。

```js
var items = new Array(-20) // 抛出RangeError
```

- `ReferenceError`
> 在找不到对象的情况下。通常在访问不存在的变量时就会发生这种错误。

- `SyntaxError`
> 当我们把错误语法传入`eval()`函数时会发生该错误。

- `TypeError`
> 在变量保存着意外的类型时，或者在访问不存在的方法时都会发生该错误。

- `URIError`
> 在使用`encodeURI/decodeURI`而`URI`格式不正确就会发生该错误。


## 抛出错误
与`try-catch`语句相配的还有一个`throw`操作符，用于随时抛出自定义错误。抛出错误时必须要给`throw`指定一个值。**在遇到`throw`操作符时代码会立即停止执行，仅当有`try...catch`语句捕获到被抛出的值时，代码才会继续执行**

## 认识`window.onerror`
将`window.onerror`放在所有脚本之前，便能对语法异常和运行异常进行处理。对语法错误和网络错误无能为力，对异步和非异步错误都能捕获到运行时错误。
