# nginx
## nginx常用命令
1. 启动`nginx`
```bash
sudo nginx
```

2. 重新启动`nginx`
```bash
sudo nginx -s reload
```
3. 停止`nginx`
- 找到master进程：
```bash
ps -ef|grep nginx
```
- 杀死进程
```bash
sudo kill -QUIT 进程号
```
4. 配置`conf`文件
sudo vim /usr/local/etc/nginx/nginx.conf

## nginx解决跨域问题
::: tip
记得把默认的`server`设置注释掉
:::

![img](/dovis-blog/other/15.png)
这样就把请求`feidao.kingdee.com`的一切接口代理到本地`172.20.166.10:8888`上。
![img](/dovis-blog/other/16.png)