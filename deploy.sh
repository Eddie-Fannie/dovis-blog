#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 定义一个输入变量
echo $1

# 生成静态文件
npm run build $1

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m $1

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Eddie-Fannie/dovis-blog.git master:gh-pages

cd -

git add .

git commit -m $1

git push origin master:master # 推到github上