md5 = require('./md5');

var Comment = {
  
  init: function(author, text, timestamp) {
    this.text = text;
    this.author = author;
    this.timestamp = timestamp;
    this.errors = [];
  },
  
  validate: function() {
    // 验证用户的用户名、邮箱是否为空
    this.errors = this.author.validate();

    // 验证内容是否为空
    if (!this.text) {
      this.errors.push({
        field: 'text', 
        message: 'Please enter text' 
      });
    }
    // 返回是否错误的信息
    return this.errors.length ? false : true;
  },

  render: function() {
    return (
      "<div class='ec-comment'>" + 
        "<div class='ec-comment__avatar'>" +
          "<img src='" + this.author.gravatar() + "'>" +
        "</div>" +
        "<div class='ec-comment__body'>" +
          "<h4 class=''>" + this.author.name  +
            "<small> on " + _renderDate(this.timestamp) + "</small>" +
          "</h4>" +
          "<p class=''>" + this.text + "</p>" +
        "</div>" +
      "</div>"
    );
  }
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  return date.toDateString() + ' at ' + date.getHours() + ':' + date.getMinutes(); 
};

module.exports = Comment;
