## 1.编写高质量JavaScript的188个建议

### 减少全局变量污染

> 定义全局变量的三种方式：
>
> 1. 在任何函数外面直接执行var语句
> 2. 直接添加一个属性到全局对象上。在Web浏览器种，全局对象名为window。
> 3. 直接使用未经声明的变量，以这种方式定义的全局变量被称为隐式的全局变量。

### 注意数据类型的特殊性

> 1. 防止浮点数溢出
>
>    ```javascript
>    num = 0.1 + 0.2; //0.30000000....
>    ```
>
> 2. 慎用Javascript类型自动转换
>
>    - 如果把非空对象用在逻辑运算环境中，则对象被转换为true
>    - 如果把对象用在数值运算环境中，则对象会被自动转换为数字，如果转换失败，则返回NaN。
>      1. 空数组则转换为0
>      2. 一个数字元素的数组则转化成该数字本身
>      3. 如果多个数字元素或者仅包含一个非数字元素的数组，则转化成NaN
>    - 当对象用于字符串环境中，Js则调用toString()方法把对象转化为字符串再进行相关计算。
>
> 3. 正确检测数据类型
>
>    - typeof null为object
>
>      > 原理是这样的。不同的对象在底层都表示为二进制，在javascript中二进制前三位都为0的话会被判断为object类型，
>      >
>      > null的二进制表示全0，自然前三位也是0，所以执行typeof时会返回“object”
>
>    - 对于对象或数组，可以使用constructor属性，该属性值引用的是原来构造该对象的函数。对于undefined和null特殊值就不能使用constructor属性，因为JS解释器会报出错误。
>
>    - 使用toString()方法检测把对象转换为字符串，返回的字符串形式如下：
>
>      ```javascript
>      [object class]
>      /*
>      	object表示对象的通用类型，class表示对象的内部类型，内部类型的名称与该对象的构造函数名对应。
>      	用户自定义对象的class值为Object
>      	
>      	要获取对象的class值唯一方法是必须调用Object对象定义的默认toString()方法，所以不能直接调用对象的该方法。要调用Object对象定义的默认toString()方法，可以先调用Object.prototype.toString对象默认toString()函数，再调用该函数的apply()方法在想要检测的对象上执行。
>       */
>      ```
>
>      ```javascript
>      var d = new Date()
>      var m = Object.prototype.toString
>      console.log(m.apply(d));//[object Date]
>      ```
>
> 4. 避免使用parseInt
>
>    > 是一个将字符串转换为整数的函数，在开始转换时，parseInt会先查看位置0处的字符，不是有效字符就返回NaN。对于以0开头的数字字符串，该函数会把它作为八进制数字处理，先把它转换为数值，然后再转换为十进制数字返回。0x开头则转为十六进制
>    >
>    > ```javascript
>    > console.log(parseInt(010)) //8
>    > ```
>    >
>    > **parseInt可以接受一个基数作为参数，这样parseInt("09",10)结果为9** 
>
> 

### 正确处理Javascript特殊值

1. 正确使用NaN和Infinity

   ```javascript
   typeof NaN === 'number' // true
   ```

2. 使用`isFinite` 函数能够检测NaN，正负无穷大。如果有限数值，或者可以转换为有限数值，那么将返回true。如果只是NaN，正负无穷大的数值，则返回false。不过该函数会把运算转换为一个数字。