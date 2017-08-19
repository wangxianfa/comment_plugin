const axios = require('axios')
const config = require('../../config/server')
const $ = require('jquery')

var Comment = {

  init: function(author, text, timestamp, id, site, originId) {
    this.text = text;
    this.author = author;
    this.timestamp = timestamp;
    this.site = site;
    this.originId = originId;
    this.errors = [];
    this.id = id;
  },


  validate: function(len) {
    if (!this.text) {
      if (this.errors.length == 0) {
        this.errors.push({
        field: 'text',
        message: '评论内容不能为空~'
        });
      }
    } else if (len > 140) {
      this.errors.push({
      field: 'text',
      message: '最多评论140个字哟~'
      });
    }
    return this.errors.length ? false : true;
  },
  

  render: function() {
    if (this.text === null || this.text === '') {
      this.text = '该评论已删除';
    }
    return (
      "<div style='margin-bottom: 30px' class='ec-comment'>" +
        "<div class='ec-comment__avatar'>" +
          "<img  src='" + this.author.avatar + "'>" +
        "</div>" +
        "<div class='ec-comment__body'>" +
          "<h4 style='margin: 0; height: 20px; line-height: 20px'>" + this.author.name  +
            "<small>" + _renderDate(this.timestamp) + "</small>" +
            "<i class='delete fa fa-trash-o fa-lg' aria-hidden='true' data-id='"+this.id+"'></i>" +
          "</h4>" +
          "<div style='margin: 0; line-height: 25px; padding: 6px 0' class='ec-content'>" + this.text + "</div>" +
        "</div>" +
      "</div>"
    );
  }
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = date.getDate();
  var h = date.getHours();
  var mm = date.getMinutes();
  var s = date.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) +  ':'  + add0(mm) + ':' + add0(s);
};

function add0(m) {return m < 10 ? '0' + m : m};

module.exports = Comment;