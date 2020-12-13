# 正则表达式RegExp

## 创建正则表达式（以字面量形式）

```javascript
var regexp = / pattern / flags 
```

**flags**

- `g`: 表示全局模式，即模式将被应用于所有字符串，而非在发现第一个匹配项就立即停止。
- `i`: 不区分大小写
- `m`: 表示多行模式

**不同组合产生不同效果** 

```javascript
/*
 * 匹配字符串中所有"at"实例
 */
var pattern1 = /at/g
/*
 * 匹配字符串第一个'bat'或者'cat'实例,不区分大小写
 */
var pattern2 = /[bc]at/i
/*
 * 匹配字符串中所有以"at"结尾的实例
 */
var pattern3 = /\.at/gi
 
// 测试
console.log(pattern1.test('catbat')) // true
console.log(pattern2.test('cadtbdat')) // false
console.log(pattern3.test('catbat')) // false
```

**元字符需要转义** 

> 正如`pattern3`例子，如果想匹配字符串中包含的元字符，就必须对它们进行转义。
>
> **元字符** 
>
> ```bash
> ( { [ \ ^ $ | ? * + . ] } )
> ```

## 使用构造函数创建正则表达式

**接受两个参数：一个是要匹配的字符串，另一个是可选的标志字符串** 

```javascript
var pattern4 = new RegExp('/\.at/','gi')
```

**由于参数为字符串形式的，所以构造函数创建正则表达式时要记得双重转义**

### 两种方式的差别

因为在ES3中正则表达式字面量始终会共享同一个`RegExp`实例，而构造函数则每次都创建一个新的实例。
ES5规定，使用正则表达式字面量必须像直接调用构造函数一样，每次都创建新的实例。

## RegExp实例属性

```javascript
字面量/构造函数形式下面结果都一样
var pattern = /\[bc\]at/i;
alert(pattern.global); // false
alert(pattern.ignoreCase); // true
alert(pattern.multiline); // false
alert(pattern.lastIndex); // 0
alert(pattern.source); // \[bc\]at
```
## RegExp实例方法

1. `exec()`

## 正则相关符号

- 方括号`[]`用法

1. [a-z] 表示从小写字母`a`到`z`之间的任意字符。`-`连字符左边字符的`ASCII`值一定要小于右边的，不然会报错。
    
   ```javascript
      /[a-Z]/g // 这样的正则会报错，因为Z的ASCII值小于a的。

      // 正确形式
      /[a-zA-Z]/g 或者/[a-z]/gi
   ``` 
2. `+`表示至少出现一次
 
3. `\n`表示换行

4. `^[a-z]`表示以任意小写字母开头的行

5. `[^abc]` 表示匹配不在方括号内的任意字符

6. `$`与`^`类似，不过是匹配某字符结尾的字符串

```javascript
var str = 'abD'
console.log(str.match(/[a-z]/gi)) // ['a', 'b', 'D']

var str = 'abD efdadD'
console.log(str.match(/[a-z]+/)) // ['ab']

var str = 'abD\nefdadD'
console.log(str.match(/[a-z]+/gmi)) // [ 'abD', 'efdadD' ]

var str = 'a5'
console.log(str.match(/^[a-z]+/)) // ['a']

var str = 'a5'
console.log(str.match(/[^a-z]+/)) // ['5']
```

- 特殊字符

  1. `\w`匹配大小写字母和数字和下划线，等同于[A-Za-z0-9_]；`\W`匹配任意非数字字母下划线

  2. `\d`等同于`0-9`;`\D`匹配任意非数字

  3. `.`匹配任意单个字符，换行和结束符除外，`{}`表示匹配多少个字符(**`n{x}`匹配包含连续`x`个`n`的字符串**)

     ```javascript
     var str = '1+0.2&2=1.4'
     console.log(str.match(/.{2}/g)) // 这里匹配两个字符，结果：[ '1+', '0.', '2&', '2=', '1.' ]
     ```

  4. `\s`匹配空白字符

  5. `\b`匹配单词边界，连续的数字字母或下划线组成的字符串会认为是一个单词; `\B`匹配非单词边界

     ```javascript
     var str = 'adobe(2016) ps6.4'
     console.log(str.match(/\b(\w+)/g)) // [ 'adobe', '2016', 'ps6', '4' ]
     
     var str = 'adobe(2016) ps6.4'
     console.log(str.match(/\B(\w+)/g)) // [ 'dobe', '016', 's6' ]
     ```
   6. 其实`“-”`在紧挨边界的时候不需要转义，也就是说可以写成：`[a-z-] 或 [-a-z]`

- 量词说明

  1.`n*`匹配包含`0`个或者多个`n`的字符串

     ```javascript
     var str = 'aa3b aa12bb'
     console.log(str.match(/a*\d+/g)) // [ 'aa3', 'aa12' ]
     
     var str = 'aad3b aa12bb'
     console.log(str.match(/a*\d+/g)) // [ '3', 'aa12' ]
     ```

  2. `n?`匹配`0`个或者`1`个字符串

     ```javascript
     var str = 'aad3b aa12bb'
     console.log(str.match(/a?\d+/g)) // [ '3', 'a12' ]
     ```

  3. `n{x,y}`匹配包含连续`x`个且最多连续`y`个`n`的字符串

     ```javascript
     var str = 'aa3b aa12bb'
     console.log(str.match(/a{2,3}\d+/g)) // [ 'aa3', 'aa12' ]
     ```

  4. `n{x,}`匹配包含至少连续`x`个`n`的字符串

     ```javascript
     var str = 'aad3b aa12bb'
     console.log(str.match(/a{2,}\d+/g)) //[ 'aa12' ]
     ```

