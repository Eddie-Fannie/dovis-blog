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
    let base = initvalue == null ? 0 : initvalue
    let startPoint = initvalue == null ? 0 : 1
    for(let i=0;i<arr.length;i++) {
        base = callback(base,arr[i],i+startPoint,arr)
    }
    return base
}
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