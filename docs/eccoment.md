# Eccomment.js

## 安装

复制下面代码到你想使用评论的地方:

```html
  <script id="echochamber">
    var EchoChamber = window.EchoChamber || {};
    (function() {
        EchoChamber.discussionURL = window.location;
        var script = document.createElement('script');
        script.src = './bundle.js';
        script.async = true;
        var entry = document.getElementById('echochamber');
        entry.parentNode.insertBefore(script, entry);
    })();
  </script>
  <script>
    //需要你生成的信息
    window.triComment = {
      username: '小明', //用户名
      avatar: 'http://10.121.8.3:8089/static/img/logo.11910a4.png', //头像地址
      originId: 'wa', //文章标识
      site: 'www.baidu.com' //网址标识
    }
  </script>

```

## 开发

要求Node: [node](https://nodejs.org/)

Fork the repo
* clone the fork
* run `npm install`
* browserify entry.js > bundle.js