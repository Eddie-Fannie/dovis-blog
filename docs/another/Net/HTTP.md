# HTTP
> `HTTP`是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范。
## 报文
`HTTP`报文分为两种：`HTTP`请求报文（请求行-`HTTP`头（通用信息头，请求头，实体头）-请求报文主体（只有`POST`才有报文主体）。响应报文则相对应的为状态行，响应报文主体。
> 通用信息头指的是请求和响应报文都支持的头域，分别为`Cache-Control`、`Connection`、`Date`、`Pragma`、`Transfer-Encoding`、`Upgrade`、`Via`；实体头则是实体信息的实体头域，分别为`Allow`、`Content-Base`、`Content-Encoding`、`Content-Language`、`Content-Length`、`Content-Location`、`Content-MD5`、`Content-Range`、`Content-Type`、`Etag`、`Expires`、`Last-Modified`、`extension-header`。

**常用头部字段解释：**
![img](/dovis-blog/other/18.png)