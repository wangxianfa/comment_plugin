const axios = require('axios')
const config = require('../../config/server')
var Emoji = require('./create_emoji.js');

var Comment = {

  init: function(author, text, timestamp, id, site, originId, cite, reply, triComment) {
    this.text = text;
    this.author = author;
    this.timestamp = timestamp;
    this.site = site;
    this.originId = originId;
    this.errors = [];
    this.id = id;
    this.cite = cite;
    this.reply = reply;
    this.triComment = triComment;
    // console.log(JSON.stringify(this.reply).length === 2)
    // this.renderReply();
  },

  validate: function(len, innerText) {
    if (!this.text || innerText.trim().length === 0) {
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


  transformEmoji: function(str) {

      if (!str) {
        str = '';
      }

      // console.log(this.triComment)
      var e = Object.create(Emoji);
      e.init(-2, this.triComment);
      // console.log(str)
      // 可以包含数字、字母、汉子、下划线
      var condition = str.match(/\[[\u4e00-\u9fa5a-zA-Z0-9_]+\]/g);
      // console.log('condition:  ' + condition)
      // console.log(condition !== null)
      if (condition !== null) {
        // console.log(condition.length);
        for (var j = 0; j < condition.length; j++) {
          var temp = condition[j].match(/[\u4e00-\u9fa5a-zA-Z0-9_]+/g)[0];
          // console.log(temp);
          for (var i = 0; i < e.DOM.emoji.length; i++ ) {
            for (var x = 0; x < e.DOM.emoji[i].length; x++) {
              if (temp === e.DOM.emoji[i][x].emojiName) {
                var rep = '<span style="display: inline-block; height: 25px; box-sizing: border-box; line-height: 25px;"><img style="width: 22px; height: 22px; margin: 0px 1px;" src="' + e.DOM.emoji[i][x].emojiurl + '"/></span>';
                // console.log('rep: ' + rep);
                str = str.replace(condition[j],rep);
                // console.log('replace:' + elecontent);
                break;
              }
            }

          }
        }
      }
      return str;
  },

  render: function() {
    var reply_display;
    if (this.text === null || this.text === '') {
      this.text = '该评论已删除';
    }

    if (this.reply.content === null || this.reply.content === '') {
      this.reply.content = '该评论已删除';
    }

    if (JSON.stringify(this.reply).length === 2) {
      reply_display = 'none';
    } else {
      reply_display = 'block'
    }

    return (
      // border、margin、padding等都必须写内联样式，不然会增加高度的不确定性
      // 不使用flex布局是为了提高兼容性
      "<div style='margin-bottom: 15px; padding: 0px 0px 10px; border-bottom: 1px solid #f1f1f1;' class='ec-comment'>" +
        "<div style='height:40px; width:40px; display: inline-block; position: absolute; left: 0; top: 0;' class='ec-comment__avatar'>" +
          "<img  src='" + this.author.avatar + "'>" +
        "</div>" +
        "<div style=' display: inline-block; position: relative; margin-left: 50px; ' class='ec-comment__body'>" +
          "<h4 style='margin: 0; height: 20px; line-height: 20px; font-weight: bold; font-size: 12px'><em>" + this.author.name  +
            "</em><small>" + _renderDate(this.timestamp) + "</small>" +
            "<span class='clearfix'><i class='delete ygkiwi-icon ygkiwi-icon-trash' data-id='" + this.id + "' data-toggle='modal' data-target='#deleteComModal' " +  "></i>" +
            "<i class='replay ygkiwi-icon ygkiwi-icon-discuss' data-id='"+ this.id +"'></i>" +
            "</span>" +
          "</h4>" +
          "<div style='display: "+ reply_display +"; line-height: 24px; padding: 0px 10px; position: relative; margin: 10px 0px 4px;' id='replyCont'>回复 <span style='font-weight: bold; display: inline-block;'>"+ this.reply.username + "</span>: " + this.transformEmoji(this.reply.content) +"</div>" +
          "<div style='margin: 0; line-height: 25px; padding: 6px 0' class='ec-content'>" + this.transformEmoji(this.text) + "</div>" +
        "</div>" +
        "<div style='clear: both;'></div>" +
      "</div>"
    );
  }
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var mm = date.getMinutes();

  var now_date = new Date();
  var now_y = now_date.getFullYear();
  var now_m = now_date.getMonth() + 1;
  var now_d = now_date.getDate();
  var now_h = now_date.getHours();
  var now_mm = now_date.getMinutes();

  const d_value = Date.parse(now_date) - timestamp;
  // console.log('timestamp: ' + d_value)


  if (y !== now_y) {
    // 跨年
    return y + '-' + add0(m) + '-' + add0(d);

  } else if (d_value < 86400000) {

    // 今天之内
    var d_hour = Math.floor(d_value%86400000/3600000);
    var d_minute = Math.floor(d_value%86400000%3600000/60000);


    if (d_hour !== 0 && d_minute !== 0) {

      return d_hour + '小时' + d_minute + '分钟前';

    } else if (d_hour === 0 && d_minute === 0) {

      return '刚刚';

    } else if (d_hour === 0) {

      return d_minute + '分钟前';

    }

  } else {
    // 其他情况
     return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) +  ':'  + add0(mm);

    }

};

function add0(m) {return m < 10 ? '0' + m : m};

module.exports = Comment;