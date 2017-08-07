const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/comment', {
  useMongoClient: true
})

const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
  console.log("数据库连接失败")
})

db.on('open', () => {
  console.log("数据库连接成功")
})