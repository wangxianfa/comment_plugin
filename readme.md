# TridentCommnent

> 这是一个提供评论服务的插件

## 项目结构

- `config/` 配置文件
- `dist/` 打包文件
- `src/` 源代码
- `src/client/` 前端插件代码
- `src/server/` Node服务端代码
- `static/` 静态文件
-  `gulpfile.js` 插件的入口文件

## 使用
>要求:   
>  `Node`: [node](https://nodejs.org/)   
>  `MongoDB`: [MongoDB](https://www.mongodb.org/)

### 1.引入

复制下面代码到你想使用评论的地方:

**你需要在每篇文章页面更新`window.triComment`对象!!**

```html
   <script>
    window.triComment = {
      domain: '', // 反向代理地址
      username: '', // 当前登录用户名
      avatar: '', // 用户头像
      originId: '', // 当前文章id
      site: '' // 当前网站标识
    }
  </script>
  <script id="echochamber">
    var EchoChamber = window.EchoChamber || {};
    (function() {
        EchoChamber.discussionURL = window.location;
        var script = document.createElement('script');
        script.src = window.triComment.domain + '/main.js';
        script.async = true;
        var entry = document.getElementById('echochamber');
        entry.parentNode.insertBefore(script, entry);
    })();
  </script>

```

### 2.运行服务

**启动mongodb**

* `npm install`
* `npm run build`
* `npm run dev`

## 配置

**config/db.js**
```
module.exports = {
    serverType: 'mongodb',
    host: 'localhost', //配置数据库地址
    port: '27017', //配置数据库端口
    db: 'comments' //数据库名称
}
```
**config/server.js**
```
module.exports = {
    serverType: 'http', 
    host: '10.122.4.96', //服务器地址
    port: '3000' //服务器端口
}
```




