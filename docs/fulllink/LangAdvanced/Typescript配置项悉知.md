# Typescript配置项悉知
```bash
tsc --init # 初始化配置项
```

## noEmitOnError
> 默认值为 `false`。配置项中添加为 `true`或者`tsc --noEmitOnError fileName.ts`时，当有报错时，不会输出`.js`文件。

## target
> 默认为`ES3`。设置输出的文件的 `ECMAScript`版本 `tsc --target es2015 fileName.ts`

## strictNullChecks
> 默认为 `false`，为 `false`时`null/undefined`可以赋予给任何类型的变量

## noImplicitAny
> 默认为 `false`，变量没有显示设置类型时，虽然会提示** 参数`s`隐式具有`any`类型。**，但是不会出现 `error`提示

::: tip
上述的严格类型检查，可以统一设定一个`strict: true`。该选项默认为 `false`
:::