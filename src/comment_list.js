var Comment = require('./comment.js');
var Author = require('./author.js');

var CommentList = {
  
  init: function (form, renderCallback) {
    var list = document.createElement('div');
    list.setAttribute('id', 'EC-list');
    list.setAttribute('class', 'ec-list');
    this.form = form;
    this.list = form.parentNode.appendChild(list);
    this.renderCallback = renderCallback;
    this.path = window.location.href; 
    this.comments = this.load();
    this.render();
  },

  load: function () {
    var rawComments = localStorage.getItem(this.path) || '[]';
    return _parse(JSON.parse(rawComments));
  },

  fetch: function () {
    var rawComments = localStorage.getItem(this.path) || '[]';
    return JSON.parse(rawComments);
  },

  save: function () {
    localStorage.setItem(this.path, this.stringify());
  },

  render: function (target) {
    var count = this.comments.length;
    this.list.innerHTML = this.buildHTML();

    // 获取评论条数
    this.form.firstChild.innerHTML = count + ' ' + _commentString(count);
  }, 

  // 数据json化
  stringify: function () {
    return JSON.stringify(this.comments.map(function(item) {
      return {
        text: item.text,
        name: item.author.name,
        email: item.author.email,
        timestamp: item.timestamp
      }
    }));
  },
  
  getHeight: function () {
    return this.list.clientHeight;
  },

  buildHTML: function () {
    // 拼接评论列表的html代码
    var comments = this.comments.slice();
    /**
     * reduce：
     * 语法：array.reduce(callbackfn, initialValue)
     * 
     * 对于数组中的每个元素，reduce方法都会调用callback函数一次，initialValue作为初始值来启动积累，第一次调用callback函数会将此值作为参数值提供
     * 
     */
    return comments.reduce(function(total, comment) {
      return total + comment.render(); 
    }, '');
  }

}

var _commentString = function(count) {
  return count === 1 ? 'comment' : 'comments';
};

var _parse = function(srcComments) {
  return srcComments.map(function(comment) {
    var c = Object.create(Comment);
    var a = Object.create(Author);
    a.init(comment.name, comment.email);
    c.init(a, comment.text, comment.timestamp);
    return c;
  });
};

module.exports = CommentList;
