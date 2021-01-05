# WebSocket
> `Websocket`是一个持久化的网络通信协议，可以在单个 `TCP` 连接上进行全双工通讯，没有了`Request`和`Response`的概念，两者地位完全平等，连接一旦建立，客户端和服务端之间实时可以进行双向数据传输

## 关联和区别
- `HTTP`
::: tip
1. `HTTP`是非持久的协议，客户端想知道服务端的处理进度只能通过不停地使用 `Ajax`进行轮询或者采用 `long poll` 的方式来，但是前者对服务器压力大，后者则会因为一直等待`Response`造成阻塞。
2. 虽然`http1.1`默认开启了`keep-alive`长连接保持了这个`TCP`通道使得在一个HTTP连接中，可以发送多个`Request`，接收多个`Response`，但是一个`request`只能有一个`response`。而且这个`response`也是被动的，不能主动发起。
3. `websocket`虽然是独立于`HTTP`的一种协议，但是`websocket`必须依赖 `HTTP` 协议进行一次握手(在握手阶段是一样的)，握手成功后，数据就直接从 `TCP`通道传输，与 `HTTP` 无关了
:::

- `socket`
1. `socket`也被称为套接字，与`HTTP`和`WebSocket`不一样，`socket`不是协议，它是在程序层面上对传输层协议（可以主要理解为`TCP/IP`）的接口封装。可以理解为一个能够提供端对端的通信的调用接口（`API`）
2. 对于程序员而言，其需要在 `A` 端创建一个 `socket` 实例，并为这个实例提供其所要连接的 `B` 端的 `IP` 地址和端口号，而在 B 端创建另一个 `socket` 实例，并且绑定本地端口号来进行监听。当 `A` 和 `B` 建立连接后，双方就建立了一个端对端的 `TCP` 连接，从而可以进行双向通信。`WebSocekt`借鉴了 `socket` 的思想，为 `client` 和 `server` 之间提供了类似的双向通信机制

## `websocket`握手
- 握手请求报文：
```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

1. `Sec-WebSocket-Key` 是由浏览器随机生成的，验证是否可以进行`Websocke`t通信，防止恶意或者无意的连接。
2. `Sec_WebSocket-Protocol`是用户自定义的字符串，用来标识服务所需要的协议
3. `Sec-WebSocket-Version` 表示支持的 `WebSocket` 版本。

- 服务器响应
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

1. `101` 响应码 表示要转换协议。
2. `Connection: Upgrade` 表示升级新协议请求。
3. `Upgrade: websocket` 表示升级为 `WebSocket` 协议。
4. `Sec-WebSocket-Accept` 是经过服务器确认，并且加密过后的 `Sec-WebSocket-Key`。用来证明客户端和服务器之间能进行通信了。
5. `Sec-WebSocket-Protocol` 表示最终使用的协议。

## 关于websocket
### websocket心跳
可能会有一些未知情况导致`SOCKET`断开，而客户端和服务端却不知道，需要客户端定时发送一个心跳 `Ping` 让服务端知道自己在线，而服务端也要回复一个心跳 `Pong`告诉客户端自己可用，否则视为断开

### websocket状态
`WebSocket` 对象中的`readyState`属性有四种状态：

- `0:` 表示正在连接
- `1`: 表示连接成功，可以通信了
- `2`: 表示连接正在关闭
- `3`: 表示连接已经关闭，或者打开连接失败

文章摘录自前端久遇 ，作者johnYu

