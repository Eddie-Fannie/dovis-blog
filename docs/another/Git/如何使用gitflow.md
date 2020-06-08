# git-flow的使用
> `git flow` 的特点便是不同的分支充当不一样的角色，并且有规定的使用场景和用法。有用于功能开发的`dev` 分支，有用于发布前准备，后期维护修复bug的分支。

## 背景

最近接手了部门的一个项目，用到了`git-flow`进行分支管理开发，所以就抽空学习了一下git-flow，提高自己团队协作开发的效率，也丰富了自己的技术知识栈。

## 安装

部门开发用MacOs，所以就可以直接使用`homebrew`	进行下载安装

```bash
brew install git-flow
```

**查看版本**

```bash
git-flow version
```

1. `git-flow` 使用两个分支来记录项目开发的历史，分别是用于**功能开发的dev分支**，还有用于**保存官方发布历史的master分支**。要记住的是，dev分支用于集成项目各种功能的开发；而master分支可以打上标签（`tag`）方便管理。----`master` 分支

2. 创建新的功能开发分支的时候，父分支应该选择`dev` 分支。但是不要在`dev`分支直接开发，而是创建特性分支，同时这个分支也可以选择推送到远程仓库，有利于团队协作开发。当功能开发完成时，或者工期到点时，可以把功能代码合并（`merge` ）到`dev` 分支，永远秉承着功能代码不直接提交到`master`分支。-----`feature`分支。

   ```bash
   // 创建feature分支 如test分支
   git flow feature start test
   // 完成该分支
   git flow feature finish test
   ```

3. 当预定发布日期临近时，可以基于开发分支新建一个用于产品发布的分支。在这个分支上修复bug,写写文档工作等不会增加大量功能代码操作。发布工作准备就绪时，就把这个分支合并到`master`分支，并用版本号打上标签，如何打标签后面会补充说明。**同时也会把发布分支合并到`dev`分支中去，这样方便在一次发布同时团队可以继续开发新功能** 。------`release`分支

   ```bash
   // 创建release分支：
   git flow release start v.1.0
   // 修改完bug之后结束分支
   git flow release finish v.1.0
   ```

   > 创建该分支后会涉及到的内容：
   >
   > - release分支将代码合并到master分支
   > - 同时会打上标签tag
   > - release分支将内容合并到dev分支
   > - release分支被删除

4. 当我们项目发布后，日后的维护工作我们需要开一个独立的分支`Hotfix` 这是唯一一种可以以`master`为父分支的分支。当维护工作做好后就要把代码合并到master和dev分支，并给master分支打上新版本标签。

## 具体开发实例

1. 执行`git-flow init`初始化一下项目

   > 利用一个反馈模块项目来初始化项目结构，可以看到如下内容，均按回车进行下一步。这个时候项目的分支默认到开发分支下，可以输入`git branch`查看当前分支

   ![img](/dovis-blog/git/gitflow-init@2x.png)

2. 自动基于开发分支下新建特性分支，执行`git flow feature start test`,test为特性分支名字，创建成功会出现下面这些信息。

   ![img](/dovis-blog/git/create-feature@2x.png)

3. 完成特性分支功能开发之后需要`git add` `git commit -m ''` 然后再`git flow feature finish test`结束特性分支。

   > 平时开发项目的时候，大家可能同时开发一个特性分支，所以需要将特性分支推送到远程仓库。
   >
   > 使用`git flow feature publish test` ，记得代码要合并到开发分支dev。

   ![img](/dovis-blog/git/publish-feature@2x.png)

4. 创建release分支来管理分布的版本

   ```bash
   ➜  feedback-all git:(develop) git flow release start v1.0
   切换到一个新分支 'release/v1.0'
   
   Summary of actions:
   - A new branch 'release/v1.0' was created, based on 'develop'
   - You are now on branch 'release/v1.0'
   
   Follow-up actions:
   - Bump the version number now!
   - Start committing last-minute fixes in preparing your release
   - When done, run:
   
   git flow release finish 'v1.0'
   ```

   > release使用版本号来命名分支，这样当我们完成release分支时，git-flow会自动提交一些标记。
   >
   > `git flow release finish v1.0`这个命令会进行下面一系列：
   >
   > 1. 拉取远程仓库来保持代码的最新状态。
   > 2. release分支内容会合并到master和develop两个分支中去。
   > 3. 会被标记上tag---这里是v1.0
   > 4. release分支删除，并且回到开发分支。

5. Hotfix分支：

   ```bash
   git flow hotfix start v.1.0 // 创建
   git flow hotfix finish v.1.0 //完成（结束）
   ```
