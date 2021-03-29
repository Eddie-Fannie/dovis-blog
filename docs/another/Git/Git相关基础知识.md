# Git基础知识

## 终端机常用命令
|Windows|macOS/Linux|说明|
|-------|-----------|---|
|`cd`|`cd`|切换目录|
|`cd`|`pwd`|获取当前所在位置|
|`dir`|`ls`|列出当前的文件列表|
|`mkdir`|`mkdir`|创建新的目录|
|无|`touch`|创建文件|
|`copy`|`cp`|复制文件|
|`move`|`mv`|移动文件|
|`del`|`rm`|删除文件|
|`cls`|`clear`| 清除画面上内容|

- 目标切换及显示
```bash
# macOS系统 ~表示home目录
$ cd ~/project/namecards/
```
- 文件列表
> `ls`命令可以列出当前目录下所有文件及目录。后面接`-al`参数中，`a`是指以小数点开头的文件也会显示，`l`则是完整文件的权限，所有者，以及创建，修改的时间。

- 文件操作
```bash
# 复制文件 并将副本命名为about.html
$ cp index.html about.html

# 把index.html更名为info.html
$ mv index.html info.html

# 删除这个目录中所有的.html文档：
$ rm *.html

# 创建文件并命名
$ echo "hello, git" > welcome.html # 创建一个内容为hello，git的welcome.html文件
```

## vim常用命令
- `normal`模式又称为命令模式，在该模式下无法输入文本，仅能复制粘贴，存储或离开操作
- 输出文本前，需要先按下`a/i/o`键中的一个键进入`Insert`模式。`i`表示插入，`a`表示`append`，`o`表示新建一行并输入。
- 在`Insert`模式下，按下`ESC/Ctrl+[`可以退至`Normal`模式。
- 在`Normal`模式下，按下`:w`存储文件，`:q`将关闭文件，`:wq`将存储完直接关闭文件。

## 用户设置
```bash
$ git config --global user.name "Eddie-Fannie"
$ git config --global user.email "1597271709@qq.com"

# 检查设置
$ git config --list
```
- 给每个项目设置不同作者
```bash
$ git config --local user.name Sherly
$ git config --local user.email sherly@qq.com
```
> 对该项目进行操作时会使用特定的用户名/E-mail来操作。离开项目后还是使用默认的作者配置。

## 设置缩写
```bash
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.st status

# 查看log
$ git config --global alias.l "log --oneline --graph"
# 查看人和时间
$ git config --global alias.ls 'log --graph --pretty=format:"%h <%an> %ar %s"'
```

::: tip
也可以直接到`~/gitconfig`中修改：
```bash
[alias]
co = checkout br = branch
```
:::

## 新增/初始 仓库
```bash
$ git init # 初始化目录让Git开始版控目录

$ git add welcome.html # 使用sourceTree则右键文件点击Add to Index。文件就可以被Git管控，被安置到了暂存区Index。
# 加入全部文件
$ git add --all
$ git add .
```
::: tip
- 在旧版本的`Git`中，`git add .`不会处理删除文件的行为。在`2.x`版本之后，`-all和.`没有区别了。
- `git add .`在某个目录下执行，会忽略目录外需要暂存的文件，只会暂存该目录下的；而`git add all`在哪个目录下执行都会暂存所有文件。
:::

```bash
# 提交至存储库
$ git commit -m "提交的信息" # 执行完这步才算完成整个流程

$ git commit -a -m "update content" # 这样可以先add，再commit
```
> 缩短操作要注意一点：这个`-a`参数只对已经存在存储库区域的文件有效，对新加入（`Untracked files`）的文件无效。

::: tip
`Git`每次的`commit`都只会处理暂存区中的内容，也就是说在执行`git commit`命令时，那些还没有被加到暂存区的文件不会被`commit`到存储库中。
:::

## 查看历史记录
```bash
$ git log

# 加上额外参数
$ git log --oneline --author="Sherly" # 查看指定作者的提交信息
$ git lon --oneline --author="Sherly\|Eddie-Fannie" # 查看这两位的 | 表示或者

$ git log --oneline --grep="LOL" #搜索符合的关键字内容 在commit信息中
$ git log -S "Ruby" # 在所有提交的文件中进行指定搜索
$ git log --oneline --since="9am" --until="12am" #查找某段时间内的提交信息
$ git log --oneline --since="9am" --until="12am" --after="2020-11-20" #在某年之后
```

## 删除文件/变更文件名
对git来说都视为改动
```bash
# 让文件脱离git控制
$ git rm welcome --cached # 这个时候文件状态变为Untracked。使用SourceTree则点击文件Stop Tracking选项即可。

# 重命名
$ git mv htllo.html world.html # 状态变为renamed
```

## 修改commit记录
- `git rebase`命令来修改
- 先把`Commit`用`git reset`命令删除，整理后重新`commit`
- 使用`--amend`参数改动最后一次`commit`