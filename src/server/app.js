const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router')
const serverConfig = require('../../config/server.js')
const config = require('../../config')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: "1mb" }));

app.use(config.build.publicPath, express.static(config.build.root))

app.all('*', (req, res, next) => {
  // console.log(req.path)
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app.get('/', (req, res) => {
  fs.readFile('./dist/test.html', (err, data) => {
    res.set('Content-Type', 'text/html');
    res.send(data);
  });
});
app.get('/getcomments', router.getComments) // 获取评论接口，可定制，但必须与router/index.js文件中的命名一致
app.get('/getreply', router.getReply)

const rawParser = bodyParser.json();

app.post('/savecomment', rawParser, router.saveComment) // 添加评论接口，可定制
app.get('/deletecomment', router.deleteComment)

app.listen(serverConfig.port, serverConfig.host , () => {
  console.log('已成功连接到' + serverConfig.host + ":" + serverConfig.port)
})


