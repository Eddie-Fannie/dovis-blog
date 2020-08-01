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

从传输的角度来说，他们都是不安全的，因为 `HTTP` 在网络上是明文传输的，只要在网络节点上捉包，就能完整地获取数据报文。要想安全传输，就只有加密，也就是 `HTTPS`。

> `GET`参数，浏览器地址栏输入参数长度限制

`HTTP` 协议没有 `Body` 和 `URL` 的长度限制，对 `URL` 限制的大多是浏览器和服务器的原因。服务器是因为处理长 `URL` 要消耗比较多的资源，为了性能和安全（防止恶意构造长`URL` 来攻击）考虑，会给 `URL` 长度加限制。
:::

## `FormData`
`XMLHttpRequest 2级`定义了该类型，为序列化表单以及创建与表单格式相同的数据提供便利
```js
var data = new FormData()
data.append('name','Nicholas')
```