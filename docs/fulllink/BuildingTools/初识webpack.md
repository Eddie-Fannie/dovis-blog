# 初识webpack
## 安装

新建一个工程目录，从命令行进入该目录，并执行`npm`的初始化命令
```bash
npm init
```
生成一个`package.json`文件，相当于`npm`项目的说明书，里面记录了项目名称，版本，仓库地址等信息。

```bash
npm install webpack webpack-cli --save-dev
```
这里我们同时安装了`webpack`以及`webpack-cli`。`webpack`是核心模块，`webpack-cli`则是命令行工具。由于我们将`Webpack`安装在了本地，因此无法直接在命令行内使用`"webpack"`指令。工程内部只能使用`npx Webpack <command>` 形式，在未简化指令前。

## 打包第一个应用

1. 首先在刚刚的工程目录下新建几个文件
```js
// Index.js
import addContent from './add-content.js'
document.write('my first webpack app');
addContent()

// add-content.js
export default function() {
  document.write('hello world')
}
```
**index.html**
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <script src="./dist/bundle.js"></script>
    </body>
</html>
```
   
2. 然后在终端输入打包命令
```bash
npx webpack --entry=./index.js --output-filename=bundle.js --mode=development
```
- `entry`参数是资源打包的入口。`Webpack`从这里开始进行模块依赖查找，得到`index.js`和`add-content.js`两个模块。
- `Output-filename`是输出资源名，打包完工程会出现一个`dist`目录，包含的`bundle.js`就是打包结果。
- `mode`参数是打包模式

3. 用浏览器打开`index.html`看效果

