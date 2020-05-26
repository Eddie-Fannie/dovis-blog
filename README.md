# Hello Vuepress

#### 执行自动化执行命令
```bash
npm run deploy '***' // ***为输入的提交信息 macOs下的

sh deploy.sh 'xxx' // xxx为输入的提交信息 window下的，在git-bash下执行文件
```

#### 释放默认主题功能组件
```bash
vuepress eject docs
```

#### 客户端增强
> enhanceApp.js下可以实现路由拦截等增强功能

#### 写文章注意
因为侧边栏只展示h1和h2的标题，所以文章要注意两个标题起的恰当