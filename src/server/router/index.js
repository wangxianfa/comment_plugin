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
    var resultData = [];

    // 查询出错，返回错误代码-1
    if (err) {
      res.send({'code': 'E01', 'message': '数据查询出错！', 'content':''});
      return;
      // db.close()
    }

    // commentModel.findById()
    var len = result.length;
    (function iterator (i) {
      if (i === len) {
        // 查询成功，返回结果
        res.send({'code': 'S01', 'message': '数据查询成功！', 'content':resultData});
        return;

      } else {

        const _result = result[i];
        if (result[i]._cite !== '') {

          // 查找回复对象数据
          commentModel.findById(result[i]._cite, (err, replydata) => {
            if (err) {
              res.send({'code': 'E01', 'message': '数据查询出错！', 'content':''});
              return;
            }

            resultData.push(Object.assign({}, JSON.parse(JSON.stringify(_result)), {'reply': replydata[0]}))
            iterator(i+1)
          })

        } else {

          resultData.push(Object.assign({}, JSON.parse(JSON.stringify(_result)), {'reply': {}}))
          iterator(i+1)
        }
      }

    })(0)

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
          res.send({'code': 'E01', 'message': '评论出错！', 'content':''});
          return;
        }
        // 评论成功，返回成功代码 1
        res.send({'code': 'S01', 'message': '评论成功！', 'content':''});
        return;
      })

    } else {
      res.send({'code': 'E01', 'message': '传入字段有误或不完整！', 'content':''});
      return;
    }

}

exports.deleteComment = (req, res) => {

  const id = req.query.id
  // console.log(id)

  commentModel.deleteComment(id, (err, result) => {
    // console.log(id)
    if (err) {
      res.send({'code': 'E01', 'message': '删除失败！', 'content':''});
      return;
    }
    // console.log(result)
    res.send({'code': 'S01', 'message': '删除成功！', 'content':''});
    return;
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