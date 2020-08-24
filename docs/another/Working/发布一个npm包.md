# 构建并发布一个vue组件到npm上
详细介绍如何发布一个`npm`包。用vue封装一个基于`canvas`的头像剪裁组件。
## 构建一个`vue`项目
```bash
vue init webpack-simple <project-name>
```
最后组件封装完成的项目目录如下：

![img](/dovis-blog/other/36.png)

其中`AvatarCrop.vue`就是组件的源码。vue官方文档有说过：Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象:
所以在项目根目录下有`index.js`文件就是为组件暴露一个`install`方法。
```js
import AvatarCrop from './AvatarCrop.vue'
AvatarCrop.install = function(Vue) {
    Vue.component(AvatarCrop.name, AvatarCrop)
}
export default AvatarCrop
```

## 使用这个组件
在项目根目录`main.js`文件中：
```js
import AvatarCrop from './index.js'

Vue.use(AvatarCrop)
```
就可以在全局下使用`AvatarCrop`组件，这里我们在`App.vue`中使用测试一下。
```html
<template>
  <div id="app">
    <avatar-crop 
    avatarUrl = 'http://api.kingdee.com/kdrive/user/file/public?client_id=200547&file_id=142265450&scode=elNmekdEODZGck1DY245M3piK3Z6&sign=42afb99c7af5944db3cc6d679832fef71cdda0ed'
    width="200px" height="200px"
    acceptType='image/png,image/jpg'
    :stepratio="100"
    :duration="300"
    :stepOnce="20"
    @uploadSucess="getBlobData"
    uploadApi = '/user/upload'
    />
  </div>
</template>
```

使用效果如图：

![img](/dovis-blog/other/37.png)

## 发布到npm
- 打包之前，首先需要修改一下`webpack.config.js`这个文件；
```js
// ... 此处省略代码 
// 执行环境
const NODE_ENV = process.env.NODE_ENV

module.exports = {
  // 根据不同的执行环境配置不同的入口
  entry: NODE_ENV == 'development' ? './src/main.js' : './src/index.js',
  output: {
    // 修改打包出口，在最外级目录打包出一个 index.js 文件，我们 import 默认会指向这个文件
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'avatarcrop.js',
    library: 'ef-avatarcrop', // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  // ... 此处省略代码 
}
```
- 修改`package.json`文件：
```js
// 发布开源因此需要将这个字段改为 false
"private": false,

// 这个指 import custom-ui 的时候它会去检索的路径
"main": "dist/avatarcrop.js",
```

- 发布npm包：
```bash
npm login // 登录，没有账号就先用邮箱注册并验证邮箱
npm publish //发布
```

## 项目中使用
然后在如iconcool项目中使用这个npm包：
```bash
npm install ef-avatarcrop -S
```

在项目`main.js`文件引入插件：
```js
import AvatarCrop from 'ef-avatarcrop'

Vue.use(AvatarCrop)
```

在项目组件中使用这个插件：
![img](/dovis-blog/other/38.png)

## 插件开发过程需要注意
1. 修改 `.gitignore` 去掉忽略`dist`,因为我们打包的文件也需要提交；每次上到`npm`上需要更改版本号，`package.json` 里的 `version` 字段
发包后如果需要修改npm包并重新发版可以，在修改后：
```bash
npm version minor # 更新一个小改动

# 然后发布
npm publish # 这个时候package.json文件中version会自动更新成1.x.0小版本

# 更新大版本
npm version major

## 更新补丁
npm version patch

## 也可以手动查看版本号并手动更改版本
npm version # 查看
npm version xxx # 手动新增一个版本号，如1.0.1
```

2. 如果想撤销刚刚发布的包可以：
```bash
npm unpublish 包名 --force
```
**不过注意，这个操作之后将会导致你需要隔24小时才能重新发包**

3. 包依赖更新后，项目中使用也需要及时更新
```bash
# 更新某个包
npm update @xxx -S/-D

# 全局删除某个包
npm uninstall @xxx -g
```

4. 插件中使用了图片的可以使用`webpack`的`url-loader`让符合`limit`的图片打包后转为`base64`的图片，那么项目使用插件就可以看到图片了。
```js
{
        // test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    test: /\.(png|jpg|gif)$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 10000,
                // name: '[name].[ext]?[hash:8]'
            }
        }
    ]
},
```
不过在`url-loader`高版本的情况下，图片会被渲染成：
```css
background-image: url([object Object]);
```
这个时候可以把`url-loader`手动降低版本为`0.6.2`就可以解决这个问题了。