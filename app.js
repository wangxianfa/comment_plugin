const express = require('express')
const app = express()
const router = require('./router')

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})
app.get('/getcomments', router.getComments) // 获取评论接口，可定制，但必须与router/index.js文件中的命名一致
app.post('/savecomment', router.saveComment) // 添加评论接口，可定制

app.listen('3000', () => {
  console.log('已成功连接3000端口')
})