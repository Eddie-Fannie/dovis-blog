# 工作中使用Git遇到的问题
## 1.合并之前提交或保存修改
> `commit your changes or stash them before you can merge`
这种情况是因为别人修改刘文件并提交，你修改的文件涉及到别人修改到文件。`git pull`会出现以上情况。

+ 解决办法：
    - 放弃修改，可以先代码做备份再回退，继续`git pull`
    - 利用`stash`数据存储（顺序：`git stash ---> git pull ---> git stash pop`)
    ::: tip
    1. `git stash`：备份当前的工作区的内容，从最近的一次提交中读取相关内容，让工作区保证和上次提交的内容一致。同时，将当前的工作区内容保存到`Git`栈中。
    2. `git stash pop`: 从`Git`栈中读取最近一次保存的内容，恢复工作区的相关内容。由于可能存在多个`Stash`的内容，所以用栈来管理，`pop`会从最近的一个`stash`中读取内容并恢复。
    3. `git stash list`: 显示`Git`栈内的所有备份，可以利用这个列表来决定从那个地方恢复。
    4. `git stash clear`: 清空`Git`栈。此时使用图形化工具会发现，原来`stash`的哪些节点都消失了。
    :::
    - 放弃本地修改，直接覆盖
    ```bash
    git reset --hard
    git pull
    ```