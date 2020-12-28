# ES6模块化
> ES6模块不是对象，而是通过`export`命令显示地指定输出的代码，再通过`import`命令输入。这种加载称为编译时加载或者静态加载。这样能保证在编译时就确定模块之间的依赖关系，每个模块的输入和输出也都是确定的。而`CommonJs/AMD`模块无法保证在编译时确定这些内容，都是运行时确定。

::: tip
+ 静态性带来的限制
    - 只能在文件顶部引入依赖
    - 导出的变量类型受到严格限制
    - 变量不允许被重新绑定，引入的模块名只能是字符串变量，即不可以动态确定依赖。
:::

## 严格模式
ES6模块自动采用严格模式；
- 变量必须声明后使用
- 函数的参数不能有同名属性
- 不能使用`with`语句
- 不能删除变量`delete prop`
- 禁止使用`this`指向全局对象
- 不能使用`fn.caller/fn.arguments`获取函数调用的堆栈
等限制。

```js
// profile.js
var firstName = 'linjiaheng'
var lastName = 'dovis'

export {firstName, lastName}
```
优先考虑这种导出的方式，可以在脚本底部直观看出导出哪些变量。

## 模块导出规则
1. 通常`export`输出的变量就是本来的名字，可以使用`as`关键字重命名。可以用不同名字输出多次。
2. `export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应的关系
```js
// 报错
export 1;
// 报错
var m = 1;
export m

// 正确
export const m = 1;

var m = 1
export {m}

var n = 1
export {n as m}
//后面三种正确方式规定了对外的接口m
```
3. `export`语句输出的接口与其对应的值是动态绑定关系的，即通过该接口可以取到模块内部实时的值。
4. `export`语句可以出现在模块的任何位置，只要处于模块顶层就可以。
5. `export`通过接口输出的是同一个值，不同的脚本加载这个接口得到的都是同样的实例。

## 模块导入规则
1. 导入的大括号中的变量名必须与被导入模块对外接口的名称相同。如果想为输入的变量重新取一个名字，要在`import`命令中使用`as`关键字，将输入的变量重命名。
2. `import`命令具有提升效果，会提升到整个模块的头部并首先执行。这种行为的本质是`import`命令是编译阶段执行的，在代码运行之前。
3. `import`静态执行，所以不能使用表达式和变量。只有在运行时才能得到结果的语法结构。
4. `import`语句会执行所加载的模块，所以这种情况成立。多次重复执行同一句，只会执行一次。
```js
import 'lodash'
```
5. 如果同一个模块，同时使用了CommonJS的`require`命令和ES6的`import`语句，由于`import`在静态解析阶段中执行，所以最早被执行。
6. `import * as 名称 from ''`用来加载整个对象
7. `import`无法在运行时加载模块。

## export default
用该语句导出的接口，可以用`import`语句指定任意名字，不使用大括号。因为`export default`只能使用一次。

本质上，`export default`就是输出一个叫做`default`的变量或方法，然后系统运行我们为他取任意名字，所以可以这么写；
```js
// module.js
function add(x,y) {
    return x +y
}
export {add as default}
// 等同于
export default add;

// app.js
import {default as xxx} from 'modules'
// 等同于
import xxx from 'modules'
```
**正是因为`export default`语句其实就是输出一个叫做`default`的变量，所以后面不能跟变量声明语句**
```js
// 错误
export default var a = 1;

// 正确
var a = 1
export default a;
```

## import和export复合写法
如果在同一个模块之中先输入后输出同一个模块，`import`语句可以与`export`语句写在一起
```js
export {foo,bar} from 'my_module'

// 等同于
import {foo,bar} from 'my_module'
export {foo, bar}
```

## import()
因为`import`命令无法动态加载模块，所以提案引入了`import()`函数完成动态加载。`import`命令可以接收什么参数，该函数就可以接收什么参数。
`import()`函数类似`Node`的`require`语句，区别是前者异步加载，后者同步加载。

+ 该函数的适用场合
    - 在需要的时候加载某个模块---按需加载
    ```js
    button.addEventListener('click', event => {
        import('./dialogBox.js')
        .then(dialogBox => {
            dialogBox.open()
        })
    })
    ```
    - 条件加载
    - 动态的模块路径
    ```js
    import(f())
    .then(...)
    // 根据函数f的返回结果加载不同的模块。
    ```

**`import()`加载模块成功之后，这个模块会作为一个对象当作`then`方法的参数，因此可以适用对象解构赋值的语法获取输出接口。**

## Node加载
1. 在静态分析阶段，一个模块脚本只要有一行`import/export`语句，`Node`就会认为该脚本为`ES6`模块，否则为CommonJS模块。如果不输出任何接口，但是希望Node认为为ES6模块，可以；
```js
export {}
```