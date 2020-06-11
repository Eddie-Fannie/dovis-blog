# 新增let const命令

## let命令
>类似var,但是所申明的变量只在`let`命令所在的代码块内有效。

```js
for(let i = 0;i<10;i++) {
    
}
console.log(i) // Uncaught ReferenceError: i is not defined
```