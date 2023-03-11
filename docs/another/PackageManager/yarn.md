# 深入浅出 Yarn 包管理工具

## `workspace`
- 开发多个互相依赖的`package`时，`workspace`会自动对`package`的引用设置软链接`（symlink）`，比`yarn link`更加方便，且链接仅局限在当前`workspace`中，不会对整个系统造成影响
- 所有`package`的依赖会安装在最根目录的`node_modules`下，节省磁盘空间，且给了`yarn`更大的依赖优化空间
- 所有`package`使用同一个`yarn.lock`，更少造成冲突且易于审查

### 如何使用workspace
根目录的package.json设置：

```js
{
  "name": "yarn-workspace-demo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
}
```

:::tip
- `private`：根目录一般是项目的脚手架，无需发布，`"private": true`会确保根目录不被发布出去。
- `workspace`：声明`workspace`中`package`的路径。值是一个字符串数组，支持`Glob`通配符。其中`"packages/*"`是常见写法，也可以枚举所有`package`： `"workspaces": ["package-a", "package-b"]`。
:::

- `yarn workspace <package_name> <command>`：在指定的`package`中运行指定的命令
- `yarn workspaces run <command>`：在所有`package`中运行指定的命令，若某个`package`中没有对应的命令则会报错
- `yarn workspaces info [--json]`：查看项目中的workspace依赖树
- `yarn <add|remove> <package> -W`：`-W: --ignore-workspace-root-check` ，允许依赖被安装在`workspace`的根目录

::: tip
`Yarn workspace`只会在根目录安装一个`node_modules`，这有利于提升依赖的安装效率和不同`package`间的版本复用。而`Lerna`默认会进到每一个`package`中运行`yarn/npm install`，并在每个`package`中创建一个`node_modules`。
目前社区中最主流的方案，也是`yarn`官方推荐的方案，是集成`yarn workspace`和`lerna`。使用`yarn workspace`来管理依赖，使用`lerna`来管理`npm`包的版本发布。
:::
