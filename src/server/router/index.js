const commentModel = require('../models/comment.js')
const querystring = require('querystring')
const db = require('../models/db')

exports.getComments = (req, res) => {
  const site = req.query.site
  const originId = req.query.originId
  const page = Number(req.query.page)

  // console.log(1)

  // 目前采用不分页的方法进行展示
  commentModel.findByCondition(originId, site, page, (err, result) => {

    // 查询出错，返回错误代码-1
    if (err) {
      res.send('-1');
      return;
      // db.close()
    }
    // 查询成功，返回结果
    res.send(result);
    return;
    // db.close()

  })

}

exports.saveComment = (req, res) => {

    const { site, originId, avater, commentbody, cite } = req.body

    // 匿名用户处理,没有用户名做匿名用户处理
    let userid = req.body.userid;
    let name = req.body.name;
    if (userid === '') {
      name = '匿名用户';
    }

    // console.log(reqbody)

    if(site && originId && commentbody) {

      commentModel.insertComment(userid, name, avater, commentbody, originId, site, cite, (err, result) => {
        // 出错，返回错误代码
        if (err) {
          res.send('-1')
          return;
        }
        // 评论成功，返回成功代码 1
        res.send('1')
        return;
      })

    }

}

exports.deleteComment = (req, res) => {

  const id = req.query.id
  // console.log(id)

  commentModel.deleteComment(id, (err, result) => {
    // console.log(id)
    if (err) {
      res.send('-1')
      return;
    }
    // console.log(result)
    res.send('1');
    return;
  })

}

exports.getReply = (req, res) => {
  const cite = req.query.cite;

  commentModel.findById(cite, (err, result) => {
    if (err) {
      res.send('-1');
      return;
    }

    res.send(result);
  })

}

function isJSON (str) {
  if(typeof str === 'string') {
    try {

      JSON.parse(str)
      return true

    } catch (e) {

      return false

    }
  }
}