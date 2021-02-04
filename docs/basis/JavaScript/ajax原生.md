# ajax原生
> `JavaScript`执行异步网络请求,有了`Ajax`之后，就可以实现在网页不跳转不刷新的情况下，在网页后台提交数据，部分更新页面内容。核心是`XMLHttpRequest`对象。

## 实现流程
- 创建`XMLHttpRequest`对象
- 打开请求地址，初始化数据
- 发送请求数据
- 监听回调函数状态
- 收到服务器返回的应答结果

```js
var xmlhttp;
function loadXMLDoc(url) {
    xmlhttp = null;
    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
    } else if(window.ActiveXObject) {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    if(xmlhttp != null) {
        xmlhttp.open('GET', url, true); // true默认异步，表示该脚本会在send()方法之后继续执行，而不等待来自服务器的响应。
        xmlhttp.send(null)
        xmlhttp.onreadystatechange = state_Change;
    } else {
        alert('Your browser does not support XMLHTTP')
    }
    function state_Change() {
        if(xmlhttp.readyState==4&&xmlhttp.status ==200) {
            var data = xmlhttp.responseText
            console.log(data)
        } else {
            alert("Problem retrieving XML data")
        }
    }
}
loadXMLDoc('http://iconcool.kingdee.com/index/mix')
```
1. 使用`XHR`对象时，要调用第一个方法是`open()`，接收三个参数：要发送的请求类型，请求的`URL`，是否异步发送请求的布尔值。调用`open()`方法不会真正的发送请求，而只是启动一个请求以备发送。
2. `send()`方法接收一个参数，即要作为请求主体发送的数据。如果不需要则传入`null`
3. `responseText`：作为响应主体被返回的文本。
4. `responseXML`：如果响应内容类型是`text/xml`或`application/xml`，这个属性中将保存包含着响应数据的`XML DOM`文档
5. `status`： 响应的`HTTP`状态。
6. `statusText`：`HTTP`状态的说明。

多数情况下我们要发送异步请求，才能让Javascript继续执行而不必等待响应。此时可以检测`XHR`对象的`readyState`属性，该属性表示请求/响应过程的当前活动阶段。取值情况：
- 0：未初始化。尚未调用`open()`方法
- 1：启动，已经调用`open()`方法，但尚未调用`send()`方法
- 2：发送，已经调用`send()`方法，但尚未接收到响应
- 3：接收：已经接收到部分响应数据
- 4：完成：已经接收到全部数据，而且已经在客户端中使用。

只要`readyState`属性的值由一个值变成另一个值，都会触发一次`readystatechange`事件。不过在调用`open()`之前指定`onreadystatechange`事件处理程序才能确保跨浏览器兼容性。
```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
        if(xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 {
            alert(xhr.responseText)
        } else {
            alert("Response was unsuccessful:" + xhr.status)
        }
    }
}
xhr.open('get', 'example.txt', true)
xhr.send(null)
```

::: tip
1. 使用`post`方式发送数据时，在调用`send`方法时，需要设置请求的`MIME`类型
- `application/x-www-form-urlencoded`:提交的数据按照 `key1=val1&key2=val2` 的方式进行编码，`key` 和 `val` 会进行了 `URL` 转码
```js
xhr.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
)
```
- `multipart/form-data`表单上传文件
- `application/json`
- `text/xml`

我们现在一般这样来使用：
- `XML` 存储数据，存储配置文件等需要结构化存储的地方使用；
- 数据传输、数据交互使用`JSON`；

2. `get/post`在ajax请求中传参的差异：
- 我们要在发送`get`请求时携带数据，只需要在调用 `open()` 方法时，将数据写在第二个参数的`URL`的 `?` 后面即可
- 发送`post`请求的过程几乎和`get`请求一样，唯一不一样的是数据的传递。大家都知道`post`请求的数据是放在请求体中的，因此我们需要调用`xhr`对象上的 `setRequestHeader()` 方法来模仿表单提交时的内容类型

```bash
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
xhr.send('query=4&em=0') 
```
:::

## Ajax的优缺点
::: tip
+ 优点：
    - 页面无刷新，在页面内与服务器通信，减少用户等待时间，增强了用户体验。
    - 使用异步方式与服务器通信，响应速度更快。
    - 可以把一些原本服务器的工作转接到客户端，利用客户端闲置的能力来处理，减轻了服务器和带宽的负担，节约空间和宽带租用成本。
    - 基于标准化的并被广泛支持的技术，不需要下载插件或者小程序。

+ 缺点：
    - 无法进行操作的后退，即不支持浏览器的页面后退。
    - 对搜索引擎的支持比较弱。
    - 可能会影响程序中的异常处理机制。
    - 安全问题，对一些网站攻击，如`csrf、xxs、sql`注入等不能很好地防御。
:::

## jquery中的Ajax请求
1. `$.ajax()`返回其创建的 `XMLHttpRequest` 对象。
```js
$.ajax({
    type: 'post',
    dataType: 'html',
    url: '/Resource/GetList.ashx',
    data: dataurl,
    success: function(data) {
        console.log(data)
    }
})
```
2. 通过远程 `HTTP GET` 请求载入信息。
> 相比于复杂的`$.ajax`而言，`GET`请求功能则显得更加简单，请求成功时可调用回调函数。当然如果需要在出错时执行函数，那么还请使用`$.ajax`。
```js
$.get('test.cgi',{name: 'john'},function(data) {
    console.log(data)
})
```
3. 通过远程 `HTTP POST` 请求载入信息。
```js
$.post('test.cgi',{name: 'john'},function(data) {
    console.log(data)
})
```
4. 通过 `HTTP GET` 请求载入 `JSON` 数据。
```js
$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",function(data){
    $.each(data.items, function(i,item){
        $("<img/>").attr("src", item.media.m).appendTo("#images");
        if ( i == 3 ) return false;
    });
});
```

## `HTTP`头部信息
发送请求时，请求头部信息
- `Accept`：浏览器能够处理的内容类型
- `Accept-Charset`：浏览器能够显示的字符集
- `Accept-Encoding`：浏览器能够处理的压缩编码
- `Accept-Language`：浏览器当前设置的语言
- `Connection`：浏览器与服务器之间连接的类型
- `Cookie`：当前页面设置的任何`Cookie`
- `Host`：发出请求的页面所在域
- `Referer`：发出请求的页面的`URL`（一个拼错的字段，应该为`referrer`）
- `User-Agent`：浏览器的用户代理字符串

使用`setRequestHeader()`方法可以设置自定义的请求头部信息。接收头部字段和头部字段的值两个参数。要成功发送请求头部信息，必须在调用`open()`方法之后且调用`send()`方法之前调用该方法。服务端接收到这种自定义的头部信息之后，可以执行相应的后续操作。调用`XHR`对象的`getResponseHeader()`方法并传入头部字段名称，可以取得相应的响应头部信息。而调用`getAllResponseHeaders()`方法则可以取得一个包含搜友头部信息的长字符串。

## `GET`/`POST`
- `GET`
    + 可以将查询字符串参数追加到`URL`末尾，以便将信息发送给服务器。查询字符串每个参数的名称和值都必须使用`encodeURIComponent`进行编码才能放到`URL`末尾。
- `POST`
    + 参数放在`body`中

::: tip
> `POST`方法更安全？
从传输的角度来说，他们都是不安全的，因为 `HTTP` 在网络上是明文传输的，只要在网络节点上捉包，就能完整地获取数据报文。要想安全传输，就只有加密，也就是 `HTTPS`。只要记得一般情况下，私密数据传输用`POST + body`就好。

> `GET`参数，浏览器地址栏输入参数长度限制
`HTTP` 协议没有 `Body` 和 `URL` 的长度限制，对 `URL` 限制的大多是浏览器和服务器的原因。服务器是因为处理长 `URL` 要消耗比较多的资源，为了性能和安全（防止恶意构造长`URL` 来攻击）考虑，会给 `URL` 长度加限制。`URL`这种东西必须当作一个整体看待，无法一块一块处理，于是就处理一个请求时必须分配一整块足够大的内存。如果`URL`太长，而并发又很高，就容易挤爆服务器的内存；
:::

::: tip
`GET`和`POST`本质上两者没有任何区别。他们都是`HTTP`协议中的请求方法。底层实现都是基于`TCP/IP`协议。上述的所谓区别，只是浏览器厂家根据约定，做得限制而已。`HTTP`请求，最初设定了八种方法。这八种方法本质上没有任何区别。只是让请求，更加有语义而已。

+ 浏览器使用的`GET/POST`：指浏览器中非`ajax`的`http`请求。浏览器用`GET`请求来获取一个`html`页面/图片等资源；用`POST`来提交一个`<form>`表单，并得到一个结果的网页。
    - 因为`GET`因为是读取，就可以对`GET`请求的数据做缓存。这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如`nginx`），或者做到`server`端（用`Etag`，至少可以减少带宽消耗）
    - 在页面里`<form>` 标签会定义一个表单。点击其中的`submit`元素会发出一个`POST`请求让服务器做一件事。这件事往往是有副作用的，不幂等的。所以浏览器实现为不能把`POST`请求保存为书签
    - 当浏览器发出一个`GET`请求时，就意味着要么是用户自己在浏览器的地址栏输入，要不就是点击了`html`里`a`标签的`href`中的`url`。所以其实并不是`GET`只能用`url`，而是浏览器直接发出的`GET`只能由一个`url`触发。所以没办法，`GET`上要在`url`之外带一些参数就只能依靠`url`上附带`querystring`。但是`HTTP`协议本身并没有这个限制。
    - 浏览器的`POST`请求都来自表单提交。每次提交，表单的数据被浏览器用编码到`HTTP`请求的`body`里。浏览器发出的`POST`请求的`body`主要有有两种格式，一种是`application/x-www-form-urlencoded`用来传输简单的数据，大概就是`"key1=value1&key2=value2"`这样的格式。另外一种是传文件，会采用`multipart/form-data`格式。采用后者是因为`application/x-www-form-urlencoded`的编码方式对于文件这种二进制的数据非常低效。
    - 浏览器在`POST`一个表单时，`url`上也可以带参数，只要`<form action="url" >`里的`url`带`querystring`就行。只不过表单里面的那些用`<input>` 等标签经过用户操作产生的数据都在会在`body`里。我们一般会泛泛的说“`GET`请求没有`body`，只有`url`，请求数据放在`url`的`querystring`中；`POST`请求的数据在`body`中。但这种情况仅限于**浏览器发请求的场景。**

+ `ajax`中的`get/post`
    - 对于请求例如几百兆压缩二进制流的请求体，服务器端接收到请求后，就可以先拿到请求头部，查看用户是不是有权限上传，文件名是不是符合规范等。如果不符合，就不再处理请求体的数据了，直接丢弃。为了进一步优化，客户端可以利用`HTTP`的`Continued`协议来这样做：客户端总是先发送所有请求头给服务器，让服务器校验。如果通过了，服务器回复`“100 - Continue”`，客户端再把剩下的数据发给服务器。如果请求被拒了，服务器就回复个`400`之类的错误，这个交互就终止了。所以就会误认为`POST`需要发送两个请求。
    - 对于`GET`方式的请求，浏览器会把`http header`和`data`一并发送出去，服务器响应`200`（返回数据）；

+ 幂等（意思是多次执⾏相同的操作，结果都是「相同」的）
    - `GET` ⽅法就是安全且幂等的，因为它是「只读」操作，⽆论操作多少次，服务器上的数据都是安全的，且每次的结果都是相同的。
    - `POST` 因为是「新增或提交数据」的操作，会修改服务器上的资源，所以是不安全的，且多次提交数据就会创建多个资源，所以不是幂等的。
:::

## `FormData`
`XMLHttpRequest 2级`定义了该类型，为序列化表单以及创建与表单格式相同的数据提供便利
```js
var data = new FormData()
data.append('name','Nicholas')
```
使用`FormData`的方便之处体现在不必明确地在`XHR`对象上设置请求头部。`XHR`对象能够识别传入的数据类型是`FormData`的实例，并配置合适的头部信息。