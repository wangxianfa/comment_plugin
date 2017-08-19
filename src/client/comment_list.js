var Comment = require('./comment.js');
var Author = require('./author.js');
var axios = require('axios')
var Emoji = require('./create_emoji.js');
const config = require('../../config/server.js')
const $ = require('jquery')

var CommentList = {

  init: function (form, renderCallback, iframe) {
    //console.log('comment_list中传入的iframe的高度' + $(iframe).height())
    // console.log("callback" + renderCallback)
    var list = document.createElement('div'); // ECList
    list.setAttribute('id', 'EC-list');
    list.setAttribute('class', 'ec-list');
    this.iframe = iframe; //  iframe
    this.form = form;  // ECForm
    //console.log('comment_list中传入的form的高度: ' + $(this.form).height())
    this.list = form.parentNode.appendChild(list);

    this.renderCallback = renderCallback;
    this.path = EchoChamber.discussionURL;
    this.comments = [];
    this.resizeForm();
    this.loadDataFromDB(window.triComment.site, window.triComment.originId);
    // this.firstload = true;
  },

  loadDataFromDB: function (site,originId) {
    var self = this;
    axios.get(window.triComment.domain + '/getcomments?site='+site+'&originId='+originId).then(function(res) {
      //console.log('res: ' + res.data);
      self.comments = self.load(res.data);
      self.render();
      self.resizeForm();
      //添加删除评论事件
      self.iframe.contentWindow.document.getElementById("EC-list").addEventListener('click',function (e) {
        if(e.target.tagName === 'I' && e.target.parentNode.nextSibling.innerText !== '该评论已删除') {
          e.target.parentNode.nextSibling.innerText = '该评论已删除';
          e.target.parentNode.nextSibling.style.fontSize = '14px';
          e.target.parentNode.nextSibling.style.color = '#c5c5c5';
          self.deleteComment(e.target.getAttribute('data-id'));
        }
      },false);
      self.iframe.contentWindow.document.querySelectorAll(".ec-comment-content").forEach(function (ele) {
        if (ele.innerText === '该评论已删除') {
          ele.style.fontSize = '14px';
          ele.style.color = '#c5c5c5';
        }
      });
    })
  },
  //删除评论
  deleteComment: function(val) {
    //console.log("this is delete");
    axios({
      method: 'GET',
      url: window.triComment.domain + '/deletecomment',
      params: {
        id: val
      }
    }).then((response) => {

      console.log(response)

    })
  },
  //获取数据后,重置form大小
  resizeForm: function () {
    var formHeight = $(this.form).height();
    // console.log(this.form)
    // console.log("comment_list中的form的Height:" + formHeight)
    var margin = parseInt(window.getComputedStyle(this.form).marginBottom);
    // console.log('comment_list中的form的margin: ' + margin);
    var num = 0; // 加上body的padding值40

    let eccomment = $(this.list).find('.ec-comment');

    for (var index = 0; index < eccomment.length; index++) {

      num += (parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).height())
      // console.log((parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).height()))
      // console.log('margin: ' + parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')))
      // console.log('height: ' + $(this.list).find('.ec-comment').eq(index).height())

    }

    num += 30;
    // console.log(num)
    // console.log('comment_list中的ECList的height: ' + num);

    // var height = 0;
    // console.log($(this.form.nextSibling.nextSibling))

    if ($(this.form.nextSibling).attr('class') === 'ec-error') {
      // console.log('显示错误提示框');
      num += 26;

      if(this.form.nextSibling.nextSibling.style.display === 'block'){

        num += ($(this.form.nextSibling.nextSibling).height() + parseInt($(this.form.nextSibling.nextSibling).css('margin-top')))

      }

    }

    if(this.form.nextSibling.style.display === 'block' && $(this.form.nextSibling).attr('id') === 'blank'){

      num += ($(this.form.nextSibling).height() + parseInt($(this.form.nextSibling).css('margin-top')))

      // console.log('marginTop: ' + parseInt($(this.form.nextSibling).css('margin-top')))
      // console.log("comment_list中的blank的高度: " + $(this.form.nextSibling).height())

    }
    // console.log("comment_list中的num: " + (num + 30) )

    // 加上上面的输入框高度和body的padding值和margin值
    num += formHeight + margin + 42;
    this.iframe.style.height = num + 10 + 'px';

    // console.log('iframe高度：' + this.iframe.style.height)

  },
  load: function (data) {
    var self = this;
    return data.map(function(ele) {
      var a = Object.create(Author);
      a.init(ele.username, ele.avatar);
      var c = Object.create(Comment);
      ele.content = self.transformEmoji(ele.content);
      c.init(a, ele.content, ele.timestamp, ele._id);
      return c;
    });
  },
  transformEmoji: function(elecontent) {
      var e = Object.create(Emoji);
      e.init(-2);
      var condition = elecontent.match(/\[[\u4e00-\u9fa5]+\]/g);
      // console.log('condition:  ' + condition)
      // console.log(condition !== null)
      if (condition !== null) {
        // console.log(condition.length);
        for (var j = 0; j < condition.length; j++) {
          var temp = condition[j].match(/[\u4e00-\u9fa5]+/g)[0];
          // console.log(temp);
          for (var i = 0; i < e.DOM.emoji.length; i++ ) {
            for (var x = 0; x < e.DOM.emoji[i].length; x++) {
              if (temp === e.DOM.emoji[i][x].emojiName) {
                var rep = '<span style="display: inline-block; padding-bottom: 8px"><img style="width: 22px; height: 22px; margin: 0 1px -6px;" src="' + e.DOM.emoji[i][x].emojiurl + '"/></span>';
                // console.log('rep: ' + rep);
                elecontent = elecontent.replace(condition[j],rep);
                // console.log('replace:' + elecontent);
                break;
              }
            }

          }
        }
      }
      return elecontent;
  },
  render: function (target) {
    var count = this.comments.length;
    if (count === 0) {
      this.form.nextSibling.style.display = 'block';
      this.resizeForm();

    } else {
      // console.log(this.form)
      // console.log(this.form.nextSibling);
      this.form.nextSibling.style.display = 'none';
    }
    this.list.innerHTML = this.buildHTML();
    this.iframe.contentWindow.document.querySelectorAll(".ec-content").forEach(function (ele) {
      if (ele.innerText === '该评论已删除') {
        ele.style.fontSize = '14px';
        ele.style.color = '#c5c5c5';
      }
    });
    this.resizeForm();
  },
  getHeight: function () {
    return this.list.clientHeight;
  },
  buildHTML: function () {
    var self = this;
    var comments = self.comments.slice();

  //  console.log(comments)
    if (comments.length > 0) {

    //  console.log('打印评论：' + comments[0].text);
      comments[0].text = self.transformEmoji(comments[0].text);
    }
    return comments.reduce(function(total, comment) {
      return total + comment.render();
    }, '');
  },

}


module.exports = CommentList;