# 慕课HTTP协议原理课程
- 输入`URL`打开网页
- `AJAX`获取数据
- `img`标签加载图片

## 网络模型
1. 物理层主要作用是定义物理设备如何传输数据
2. 数据链路层在通信的实体间建立数据链路连接
3. 网络层为数据在结点之间传输创建逻辑链路（`IP`）
4. 传输层（`TCP/UDP`）。向用户提供可靠的端到端服务
5. 应用层`HTTP`。为应用软件提供很多服务。构建`TCP`协议之上，屏蔽网络传输相关细节。

## HTTP协议历史
- `http/0.9`
    + 只有一个`GET`命令
    + 没有`Header`等描述数据的信息
    + 服务器发送完毕就关闭`TCP`连接

- `http/1.0`
    + 增加了很多命令
    + 增加了状态码和头部
    + 多字符集支持，多部分发送，权限/缓存等

- `http/1.1`
    + 持久连接
    + 管道化（同一个连接发送多个`http`请求，依然会阻塞`）
    + 增加`host`和其他一些命令

- `http2`
    + 所有数据二进制传输
    + 同一个连接里面发送多个请求不再需要按照顺序来，并行请求
    + 头部信息压缩以及推送等提高效率的功能

::: tip
头部字符串占用了带宽的量，压缩头部能减少带宽使用
:::

## HTTP三次握手
`http`只进行数据包的请求和响应，连接是`TCP`的概念。三次网络传输才能创建`TCP`连接

## URL URI URN
`URI` 统一资源标志符 `Uniform Resource Identifier` 
`URL` 统一资源定位器 
`URN` 永久统一资源定位符

### 认识HTTP客户端
```bash
curl www.baidu.com # 在gitbash输入这个也相当于发送请求
```

![img](/dovis-blog/other/80.png)

::: tip
`curl`用来请求`web`服务器。[curl用法指南](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)
:::

### 跨域预请求
如果是因为不在简单请求里面的头部导致的复杂请求`option`。可以在服务设置`'Access-Control-Allow-Headers': '复杂请求头部名称'`。方法呢则通过设置`Access-Control-Allow-Methods`。设置`Access-Control-Max-Age`可以设置多少秒内不再发送预检请求

### Cookie
`Cookie`可以设置多个。没有设置过期时间浏览器关闭就没了

![img](/dovis-blog/other/81.png)

::: tip
`max-age`多长时间过期；`expires`是到什么时间过期（计算麻烦）

设置`domain`就可以让所有二级域名都访问到`cookie`
:::

### HTTP长连接
不同域时请求会重新开启一个`TCP`连接

### 数据协商
请求里通过`Accept`来告诉服务端自己想要什么类型。`Accept-Encoding`等
返回则通过`Content-Type`