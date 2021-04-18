# express框架基础知识
## express路由匹配规则
在Express中，除了完整匹配，还支持模糊匹配，例如：

```js
router.get('/wes?t', function(req, res, next) {
  res.render('index', { title: 'Hello World'})
})
```

> 在浏览器中查看，会发现当请求`http://localhost:3000/west`和`http://localhost:3000/wet`都可以生效。

## 更换模版引擎
Express默认模版引擎为`jade`，为了便于用户上手替换成`art-template`

```bash
npm install -S art-template
npm install -S express-art-template
```
两个依赖包安装完成之后，修改项目根目录下的`app.js`文件，将其中的：
```js
app.set('view engine' ,'jade')
```
修改成：
```js
app.engine('.html', require('express-art-template'))
app.set('view engine', 'html')
```

> 在模版引擎上使用双括号来接受接口返回的变量

## 条件渲染
在模版引擎`index.html`中：
```html
<body>
  <h1>这是一个HTML文件 {{ title }}</h1>
  <h2>{{ name }}</h2>

  <!-- 判断年龄小于30 -->
  {{ if age< 30}}
  <p>大家好，这是不到30岁的{{name}}</p>
  {{/if}}

  <!-- 判断年龄大于30 -->
  {{ if age> 30}}
  <p>大家好，这是超过到30岁的{{name}}</p>
  {{/if}}
</body>
```

```js
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    age: 25,
    name: '林嘉恒'
  });
});
```

> 在`art-template`中，如上述示例，`if`判断有固定的写法。

## 循环渲染
```html
<!-- 循环 传入一个skill数组字段，每一项为item-->
  {{each skill as item}}
  <p>数据id: {{item.id}}, 技术栈: {{item.label}}</p>
  {{/each}}
```

## 循环渲染结合条件渲染
```html
<!-- 循环 每一项为item-->
  {{each skill as item}}
  <!-- 判断skill中每一项的id属性是否和targetId属性相等 -->
  {{if item.id === targetId}}
  <p style="color: red;">数据id: {{item.id}}, 技术栈: {{item.label}}</p>
  {{else}}
  <p style="color: blue;">数据id: {{item.id}}, 技术栈: {{item.label}}</p>
  {{/if}}
  {{/each}}
```

```js
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    age: 25,
    name: '林嘉恒',
    skill: [
      {label: 'Vue', id: 0},
      {label: 'Javascript', id: 1},
      {label: 'html', id: 2},
    ],
    targetId: 2,
  });
});
```

## 请求对象Request
1. `Request.url`获取请求地址的属性。
2. `Request.query`常用来获取`GET`请求参数，为一个对象，包含路由中每个查询字符串参数的属性，如果没有查询字符串则为空对象`{}`。**只能获得`GET`请求方式的参数**

```js
router.get('book', function(req, res, next) {
  console.log(req.query)
  res.render('index', { title: 'Express'})
})
```
> 在浏览器中打开`http://localhost:3000/book?id=15`就可以输出`{id:15}`。 要注意的是接口不能定义成`book?id=15`，这样子会解析成其他的字符串，而给不出你想要的结果。

3. `request.body`获取`post`方法的参数。
::: tip
```js
router.post('/abc', function(req, res, next) {
  console.log(req.body);
  res.send(req.body)
})
```

`res.send()`不会渲染页面，而会直接输出传入的参数，以方便查看。可以利用postman来增加参数进行演示，`Post`参数的方法是在`Body`中添加字段和值。最常用的是`www-form-urlencoded`
:::

4. `request.params`获取`Url`中自定义参数。`Get`请求。

```js
router.get('/book/:userId/:id', function(req, res, next) {
  res.send(req.params);
})
```
![img](/dovis-blog/other/87.png)

5. `request.headers`获取请求头的数据。
6. `request.cookies`获取客户端请求头传过来的`cookie`。`request.headers`中也可以拿到，不过是字符串。Express为了方便处理所以将`cookie`信息保存在`Request.cookies`属性中，如果请求不包含`cookie`则默认为{}；

## 返回对象Response
1. `Response.render()`方法是渲染页面的一个方法。有三个参数：

<!-- |参数顺序|参数|参数类型|是否必须|作用| -->
|参数顺序|参数|参数类型|是否必须|作用|
|-------|-----|------|----|-----|
|1|`view`|`String`|是|页面文件，用于渲染的文件路径|
|2|`locals`|`Object`|否|属性定义页面的局部变量|
|3|`callback`|`Function`|否|回调函数。返回可能的错误和呈现的字符串，但不执行自动响应。发生错误时，该方法在`next(err)`内部调用|

```js
// 设置一个局部变量，渲染到user页面上
res.render('user', {
  name: 'Tobi'
}, function(err, html) {
  // 渲染完毕到回调函数
})
```

2. `Response.send()`方法是发送一个`HTTP`响应至前端，它只接收一个参数，这个参数可以是任何类型，之所以可以接收任何类型到参数，是因为执行这个方法返回到时候会自动设置响应头数据类型，即响应头里到`Content-Type`字段。

::: tip
1. 当参数是`Buffer`对象时，`Response.send()`方法将`Content-Type`响应头字段设置为`application/octet-stream`
2. 当参数是字符串时，设置为`text/html`
3. 当参数为数组/对象时，则设置为`application/json`
:::

3. `Response.json()`返回JSON格式当数据。只接收一个参数，可以是任何JSON格式类型当数据，包括对象，数组，字符串，布尔值或者数字，甚至可以将其他值转换成JSON格式类型，例如`null/undefined`

4. `Response.status()`给前端指定的状态码。
```js
router.post('/abc', function(req, res, next) {
  console.log(req.body);
  res.status(403).end()
})
```
> 使用该方法时，后面一定要有结束方法`end()`或者发送方法`send()/json()`等，因为该方法并不是返回结果，只是设置一个状态

```js
router.get('/book/:userId/:id', function(req, res, next) {
  res.status(200).send(req.params);
})
```
5. `response.redirect()`，方法跳转指定路由。
```js
router.get('/book', function(req, res, next) {
  res.redirect('/book2');
})
router.get('/book2', function(req, res, next) {
  res.end()
})
```
也可以重定向到一个任意的`URL`。还可以设置状态码
```js
router.get('/book', function(req, res, next) {
  res.redirect(301, '/book2');
})
```