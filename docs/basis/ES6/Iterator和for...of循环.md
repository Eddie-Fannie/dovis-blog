# `Iterator`和`for...of`循环
> 表示集合的数据结构有`Array/Object/Map/Set`。遍历器为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署`Iterator`接口，就可以完成遍历操作。

::: tip
`Iterator`作用有三个：
- 为各种数据结构提供一个统一的，简便的访问接口；
- 使得数据结构成员能够按某种次序排列；
- ES6创造了一种新的遍历命令`for...of`循环，`Iterator`接口主要供`for...of`消费。

`Iterator`遍历过程如下：
1. 创建一个指针对象，指向当前数据结构的起始位置。遍历器对象本质上是一个指针对象。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指向数据结构第二个成员。
4. 不断调用`next`方法，直到数据结构的结束位置。
> 每次调用`next`方法都会返回数据结构的当前成员的信息。具体来说就是一个包含`value`和`done`两个属性的对象。`done`表示遍历是否结束。**对于遍历器对象来说，`done:false`和`value:undefined`属性是可以省略的。

**当用`for...of`循环遍历某种数据结构时，该循环会自动去寻找`Iterator`接口。
:::

## 默认`Iterator`接口
> ES6规定默认的`Iterator`接口部署在数据结构的`Symbol.iterator`属性，一个数据结构具有该属性就是可遍历的。

```js
const obj = {
    [Symbol.iterator]: function() {
        return {
            next:function() {
                return {
                    value: 1,
                    done: true
                }
            }
        }
    }
}
```