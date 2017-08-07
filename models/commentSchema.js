const mongoose = require('mongoose')
const Schema = mongoose.Schema
const db = require('./db')

var commentSchema = new Schema({
  site : String,
  originId : String,
  name : String,
  avater : String,
  comments : [
    {
      body : String,
      timestamp : Number
    }
  ]
},{collection : 'comment'})

/**
 * 函数说明：数据查询
 * findByCondition(condition, callback)
 * condition ： 查询条件，为json数据
 * callback ：回调函数 参数：err：出错参数, resultData：查询到的数据(Array)
 */
commentSchema.statics.findByCondition = (condition = {}, callback) => {
  return commentModel.find(condition).exec(callback)
}


/**
 * 说明：数据更新，先查询数据是否存在，存在则追加评论，不存在则添加数据
 * updateData(site, originId, name, avater, commentbody, callback)
 * site : 网站地址
 * originId : 文章id
 * name : 评论者姓名
 * avater ： 头像
 * commentbody ： 评论内容
 * callback ：回调函数，参数：err：出错参数，result：结果参数 { n: 1, nModified: 1, ok: 1 }
 */
commentSchema.statics.updateData = (site, originId, name, avater, commentbody, callback) => {
  // 形成数据
  const timestamp = Date.parse(new Date())
  const condition = {"site": site, "originId": originId, "name": name}
  const comment = {"body": commentbody, "timestamp": timestamp}

  // 先查询是否存在该作者的评论数据记录
  commentModel.findByCondition(condition, (err, resultData) => {
    if (err) throw new Error(err)

    // console.log(resultData)
    if (resultData.length > 0) {
      // 存在数据记录，追加评论
      commentModel.update(condition, {$push: {"comments": comment}}).exec(callback)

    }else{
      // 不存在改数据记录，插入数据记录
      const newData = Object.assign({},condition, {"avater": avater}, {"comments": comment})
      new commentModel(newData).save((err) => {

        if (err) {

          console.log("数据插入出错")

        }

        console.log("数据插入成功")

      })

    }
  })

}

var commentModel = mongoose.model('commentModel', commentSchema)

// commentModel.updateData('http://www.baidu.com', '12', '王先发2', '/src/images/1.png', '夜色真美啊', (err, result) => {
//   if (err) {
//     throw new Error(err)
//   }

//   console.log(result)
//   console.log("数据更新成功")
// })

// commentModel.findByCondition({}, (err, result) => {
//   if (err) throw new Error(err)

//   console.log(result)
// })

module.exports = commentModel