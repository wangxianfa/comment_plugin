# TridentCommnent

> 这是一个提供评论服务的插件

## 项目结构
---

- `config/` 配置文件
- `dist/` 打包文件
- `src/` 源代码
- `src/client/` 前端插件代码
- `src/server/` Node服务端代码
- `static/` 静态文件
-  `gulpfile.js` 插件的入口文件

## 使用
---

### 1.依赖
>要求:
>  `Node`: [node](https://nodejs.org/)
>  `MongoDB`: [MongoDB](https://www.mongodb.org/)

### 2.使用

1、引入，受限必须引入main.js文件 ( **在引入main.js时必须在src前面拼接基于反向代理的domain值，也即是所传参数中的domain值** )
```JavaScript
<script id="echochamber" src='/main.js'></script>
```

2、方法
  * 初始化：调用方法 var tri = new $.triComment( parameter ) // 返回一个tri对象
  * 重新加载：调用方法 tri.reload( parameter ) // 调用返回对象的reload方法

3、参数说明
  parameter参数为一个json数据，包含内容如下
  ```JavaScript
  {
    domain: '',
    userid: 'xiaoxiaofa', // 评论者自己id
    username: '小小发',
    avatar: '/static/images/dn.jpg',
    originId: 'waa',
    commentable: true, //文章突然设为私有，是否可继续正在进行的评论，此处还需要商量
    site: 'www.baidu.com',
    isAuthor: true // 文章作者
  }

  ```

### 3.运行

* 先启动 &nbsp;`mongodb`
* `npm install` &nbsp;安装`npm`依赖
* `npm run build` &nbsp;打包文件
* `npm run dev` &nbsp;运行服务

## 配置
---

**config/db.js**
```
module.exports = {
    adapter: 'mongodb',
    uri: 'http://10.122.4.95:27017/comments' //配置数据库连接
}
```
**config/server.js**
```
module.exports = {
    serverType: 'http',
    host: '10.122.4.95', //服务器地址
    port: '3000' //服务器端口
}
```
