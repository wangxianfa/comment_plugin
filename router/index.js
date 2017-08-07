const commentModel = require('../models/commentSchema')
const querystring = require('querystring')

exports.getComments = (req, res) => {
  const condition = {"site" : req.query.site, "originId": req.query.originId}

  commentModel.findByCondition(condition, (err, result) => {
    // 查询出错，返回错误代码-1
    if (err) res.send('-1')
    // 查询成功，返回结果
    res.send(result)

  })

}

exports.saveComment = (req, res) => {

  var reqbody = ''
  req.on('data', (chunk) => {

    reqbody += chunk

  })

  req.on('end', () => {
    // 参数解析
    reqbody = querystring.parse(reqbody) // 将字符串序列化为一个对象

    const { site, originId, name, avater, commentbody } = reqbody

    if(site && originId && name && avater && commentbody) {

      commentModel.updateData(site, originId, name, avater, commentbody, (err, result) => {
        // 出错，返回错误代码
        if (err) res.send('-1')
        // 评论成功，返回成功代码 1
        res.send('1')
      })

    }
  })

}