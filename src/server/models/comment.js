/**
 * 留言及相关信息
 */
const db = require('./db.js'),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CommentSchema = new Schema({
  userid: {
    type: String
  },
  username : {
    type : String
  },
  avatar : {
    type : String
  },
  content : {
    type : String
  },
  originId : {
    type : String
  },
  site : {
    type : String
  },
  timestamp : {
    type : Number
  },
  total : {
    type : Number
  },
  like : {
    type : Number
  },
  _cite : {
    type : String
  }
});

/**
 * 函数说明：查询文章相关留言(分页)
 * findByCondition()
 * originId : 文章Id
 * site : 网站地址
 * page : 当前页面
 */
CommentSchema.statics.findByCondition = function (originId, site, page, callback) {

  // console.log(1)
  var condition = {
    'originId' : originId,
    'site' : site
  }
  return CommentModel.find(condition).skip( (page - 1) * 10).limit(10).sort({'timestamp' : -1}).exec(callback);
}

CommentSchema.statics.findById = function (cite, callback) {
  console.log(cite)
  var condition = {
    '_id': cite
  }

  return CommentModel.find(condition).exec(callback);
}

/**
 * 函数说明：查询文章相关留言(强调：不分页)
 * findByCondition()
 * originId : 文章Id
 * site : 网站地址
 */
CommentSchema.statics.findByCondition_Nopage = function (originId, site, callback) {
// console.log(1)
  var condition = {
    'originId' : originId,
    'site' : site
  }
  return CommentModel.find(condition).sort({'timestamp' : -1}).exec(callback);
}


/**
 * 函数说明： 插入相关的留言内容
 * insertComment(username, avatar, content, originId, site, timestamp)
 * username : String
 * avatar : String
 * content : String
 * originId : String
 * site : String
 * timestamp : Number (自动生成)
 */
CommentSchema.statics.insertComment = function (userid, username, avatar, content, originId, site, cite, callback) {
  const timestamp = Date.parse(new Date());
  var allInfo = {
    'userid' : userid,
    'username' : username,
    'avatar' : avatar,
    'content' : content,
    'originId' : originId,
    'site' : site,
    'timestamp' : timestamp,
    '_cite' : cite
  }

  // console.log(allInfo)
  return CommentModel.create(allInfo, callback)
}

/**
 * 函数说明：返回评论总数
 * commentsCount()
 */
CommentSchema.statics.commentsCount =  function () {
  CommentModel.find (function(err,docs) {
    if (err) console.log('err' + err);
    return docs.length;
  });
}

/**
 *  函数说明：删除评论
 *  deleteComment()
 *  特别说明：这里的删除并不是真正从数据库中进行删除，而是将数据库的该评论清空
 *  _id: 评论的id
 *  callback: 返回函数
 */
CommentSchema.statics.deleteComment =  function (_id, callback) {
  // console.log(1);
  return CommentModel.update ({'_id': _id}, {'content': '', 'avatar': '/static/images/demo.png'}, callback);
}

var CommentModel = mongoose.model('CommentModel', CommentSchema);
module.exports = CommentModel

/**
 * 测试内容：
 */

//var CommentModel = mongoose.model('CommentModel', CommentSchema);

//CommentModel.insertComment('13','24','11151','25422','111111143');
// CommentModel.findByCondition('articleid', 'http://www.baidu.com', 1, (err, data) => {
//   console.log("结果：")
//   console.log(data)
// })
// console.log(CommentModel.findByCondition_Nopage('wwa','www.baidu.com',  (err, data) => {
//   console.log(data)
// }));
//CommentModel.commentsCount();
// CommentModel.deleteComment('599104e6a181e41f64b6aa09', (err, data) => {
//   if (err) console.log('err' + err);
//   console.log(data);
// });
