var Comment = require('./comment.js');
var Author = require('./author.js');
var axios = require('axios')
var Emoji = require('./create_emoji.js');
var Reply = require('./reply.js')
const config = require('../../config/server.js')
const commonFunc = require('./commonFunc.js')


var CommentList = {

  init: function (form, renderCallback, iframe, triComment) {
    this.DOM = {};
    this.triComment = triComment;
    this.mouseindex = 0;
    this.err = [];

    var list;
    if (!iframe.contentWindow.document.getElementById('EC-list')) {
      // console.log("新创建的")
      list = document.createElement('div'); // ECList
      list.setAttribute('id', 'EC-list');
      list.setAttribute('class', 'ec-list');
    } else {
      list = iframe.contentWindow.document.getElementById('EC-list');
    }

    this.iframe = iframe; //  iframe
    this.doc = this.iframe.contentWindow.document;

    // const overlay = document.createElement('div');
    // overlay.className = 'overlay';
    // this.overlay = overlay;
    // iframe.parentNode.appendChild(overlay);

    this.form = form;  // ECForm
    //console.log('comment_list中传入的form的高度: ' + $(this.form).height())
    this.list = form.parentNode.appendChild(list);

    // 初始化page值
    this.page = 1;

    // 是否还有更多
    this.haveMore = true

    if (this.iframe.contentWindow.document.getElementById('loadMore')) {
      this.iframe.contentWindow.document.body.removeChild(this.iframe.contentWindow.document.getElementById('loadMore'))
    }

    // 创建加在更多
    this.loadmore = document.createElement('div'); // ECList
    this.loadmore.setAttribute('id', 'loadMore');
    this.loadmore.style.height = '24px';
    this.loadmore.style.lineHeight = '24px';
    this.loadmore.style.margin = '15px auto 0';
    this.loadmore.style.maxWidth = '92px';
    form.parentNode.appendChild(this.loadmore);
    this.loadmore.innerHTML = '查看更多评论';

    this.renderCallback = renderCallback;
    this.path = EchoChamber.discussionURL;
    this.comments = [];
    this.addEventListener();
    this.resizeForm();
    this.loadDataFromDB(this.triComment.site, this.triComment.originId);
    // this.firstload = true;

    this.errors = [];


  },
  // 事件监听
  addEventListener: function () {
    var self = this;
    $(this.loadmore).on('click', this.loadMore.bind(this));
    //添加删除评论事件
    var ECList = self.iframe.contentWindow.document.getElementById("EC-list");

    ECList.addEventListener('click', function (e) {
      var item = e.target;

      // 删除
      if (item.tagName === 'I' && item.getAttribute('class').indexOf('delete') !== -1) {
        var modal = window.top.document.querySelector('#deleteComModal');
        $(modal).modal('show');
        $(modal.getElementsByTagName('button')[1]).off('click').on('click', function () {
          self.deleteComment(item.getAttribute('data-id'));
          self.resizeForm();
        })

      }

      // 回复
      if (item.tagName === 'I' && item.getAttribute('class').indexOf('replay') !== -1) {

        // 移除其他
        if (self.iframe.contentWindow.document.getElementById('reply')) {
         $(self.iframe.contentWindow.document.getElementById('reply')).remove();
         self.emoji = '';
        }

        // console.log($(item.parentNode.parentNode.parentNode.lastChild).attr('id'))
        if ($(item.parentNode.parentNode.parentNode.lastChild).attr('id') !== 'reply') {
          var reply = Object.create(Reply)
          let replyto = item.parentNode.parentNode.firstChild.innerText;
          reply.init(replyto, self.triComment)

          item.parentNode.parentNode.parentNode.appendChild($(reply.render()).get(0))

          self.doc.getElementById('ec-replay-emoji-face').addEventListener('click', self.emojiClick.bind(self))
          self.doc.getElementById('replySubmit').addEventListener('click', self.replySubmit.bind(self, $(item).attr('data-id')));
          self.DOM.replyTextarea = self.doc.getElementById('replyTextarea');
          self.DOM.replyTextarea.addEventListener('mouseup', self.onTextareaMouseup.bind(self));
          self.DOM.replyTextarea.addEventListener('keyup', self.onTextareaKeyup.bind(self));
          self.DOM.replyTextarea.addEventListener('focus', self.onTextareaFocus.bind(self));

          // 给文本框增加自动resize事件
          $(self.DOM.replyTextarea).on('input', self.autoResizeHeight.bind(self))
        }

        self.resizeForm()

      }

    }, false);

    var ReplyDiv = self.iframe.contentWindow.document.getElementById("reply");

  },

  // 加载评论
  loadDataFromDB: function (site, originId, load) {
    var self = this;

    // 重置page
    if (!load) {
      self.page = 1;
    }

    // 加一个timestamp是为了解决浏览器缓存问题
    axios.get(self.triComment.domain + '/getcomments?site=' + site + '&originId=' + originId + '&page=' + this.page + '&timestamp=' + Date.parse(new Date()))
    .then(function (res) {

      // 加载更多
      // 显示加在更多
      if (self.loadmore.style.display === 'none') {
        self.loadmore.style.display = 'block';
      }

      if (res.data.content.length > 0 && load) {
        self.comments = self.comments.concat(self.load(res.data.content));
      } else if (!load) {
        self.comments = self.load(res.data.content);
      }

      if (res.data.content.length < 10) {
        self.haveMore = false;
        self.loadmore.innerHTML = '没有更多评论';
        self.loadmore.style.color = '#a2a2a2';
        self.loadmore.style.cursor = 'default';
      } else {
        self.haveMore = true;
        self.loadmore.innerHTML = '查看更多评论';
        self.loadmore.style.color = '#90c16f';
        self.loadmore.style.cursor = 'pointer';
      }

      self.render();
      self.validate(self.comments);

    }).catch(function(res) {
      console.log(res)
    })
  },
  //删除评论
  deleteComment: function (val) {
    //console.log("this is delete");
    axios({
      method: 'GET',
      url: this.triComment.domain + '/deletecomment',
      params: {
        id: val
      }
    }).then((response) => {

      // console.log(response)
      this.loadDataFromDB(this.triComment.site, this.triComment.originId, false);

    })
  },

  /**
   * 删除权限设置
   * 1、作者本人可以删除自己文章的任何评论
   * 2、用户可以删除自己的评论
   * 3、匿名用户的评论不能进行删除
   * 否则删除按钮屏蔽掉
   */
  validate: function (userid) {
    // console.log(1111111)
    var isAuthor = this.triComment.isAuthor;
    var self = this;
    // forEach在IE下有兼容性问题
    var del = $(self.iframe.contentWindow.document.getElementById("EC-list")).find('.delete');

    for(var i = 0; i< del.length; i++) {
      var isCommentUser = self.triComment.userid === userid[i].author.userid ? true : false;
      // console.log('isAuthor: ' + isAuthor)
      // console.log('isCommentUser: ' + isCommentUser)
      // var delete = ele.lastChild.
      if (!isAuthor && !isCommentUser) {
        del[i].style.display = 'none';
      } else if (self.triComment.userid === '') {
        del[i].style.display = 'none';
      }
    }

    this.resizeForm();
  },
  //获取数据后,重置form大小
  resizeForm: function () {
    var formHeight = $(this.form).get(0).offsetHeight;
    // console.log("comment_list中的form的Height:" + formHeight)
    var margin = parseInt(window.getComputedStyle(this.form).marginBottom);
    // console.log('comment_list中的form的margin: ' + margin);
    var num = 0; // 加上body的padding值40

    let eccomment = $(this.list).find('.ec-comment');

    for (var index = 0; index < eccomment.length; index++) {

      num += (parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).get(0).offsetHeight + 1)
      // console.log((parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).get(0).offsetHeight + 1))
      // console.log('margin: ' + parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')))
      // console.log('height: ' + $(this.list).find('.ec-comment').eq(index).get(0).offsetHeight)
    }

    num += 30;
    // console.log('comment_list中的ECList的height: ' + num);

    // var height = 0;
    // console.log($(this.form.nextSibling.nextSibling))

    if ($(this.form.nextSibling).attr('class') === 'ec-error') {
      // console.log('显示错误提示框');
      num += 26;

      if (this.form.nextSibling.nextSibling.style.display === 'block') {

        num += ($(this.form.nextSibling.nextSibling).height() + parseInt($(this.form.nextSibling.nextSibling).css('margin-top')))

      }

    }

    if (this.form.nextSibling.style.display === 'block' && $(this.form.nextSibling).attr('id') === 'blank') {

      num += ($(this.form.nextSibling).height() + parseInt($(this.form.nextSibling).css('margin-top')))

      // console.log('marginTop: ' + parseInt($(this.form.nextSibling).css('margin-top')))
      // console.log("comment_list中的blank的高度: " + $(this.form.nextSibling).height())

    }

    if ($(this.loadmore).css('display') === 'block') {

      num += ($(this.loadmore).height() + parseInt($(this.loadmore).css('margin-top')))

    }

    // console.log('加载更多高度：' + ($(this.loadmore).height() + parseInt($(this.loadmore).css('margin-top'))))

    // 加上上面的输入框高度和body的padding值和margin值
    num += formHeight + margin + 42;
    this.iframe.style.height = num + 10 + 'px';
    // this.overlay.style.height = num + 10 + 'px';

    console.log('iframe高度：' + this.iframe.style.height)

  },
  load: function (data) {
    var self = this;
    return data.map(function (ele) {
      var a = Object.create(Author);
      a.init(ele.userid, ele.username, ele.avatar);
      var c = Object.create(Comment);
      // console.log(self.triComment) //正常
      c.init(a, ele.content, ele.timestamp, ele._id, self.triComment.site, self.triComment.originId, ele._cite, ele.reply, self.triComment);
      return c;
    });
  },
  render: function () {

    var self = this;
    var count = this.comments.length;
    if (count === 0) {
      this.form.nextSibling.style.display = 'block';
    } else {
      // console.log(this.form)
      // console.log(this.form.nextSibling);
      this.form.nextSibling.style.display = 'none';
    }
    this.list.innerHTML = this.buildHTML();
    var i = $(self.iframe.contentWindow.document.getElementById("EC-list")).find('i');
    // var i = this.iframe.contentWindow.document.getElementById("EC-list").querySelectorAll('i');


    if (navigator.userAgent.toLowerCase().match(/mobile/i) == 'mobile') {
      // alert(1)
      for (var j = 0; j< i.length; j++) {
        i[j].style.display = 'block';
      }

    }

    // querySelectorAll在ie下会返回一个NodeList，不能使用forEach遍历, 通过jQuery解决兼容性问题
    var eclist = $(self.iframe.contentWindow.document.getElementById("EC-list")).find('.ec-content');

    for (var i = 0; i < eclist.length; i++) {

      if (eclist[i].innerText === '该评论已删除') {
        eclist[i].style.fontSize = '14px';
        eclist[i].style.color = '#c5c5c5';
        // console.log(eclist[i].parentNode.previousSibling.firstChild);
        eclist[i].parentNode.previousSibling.firstChild.src = self.triComment.domain + '/static/images/demo.png'
          // console.log(eclist[i].previousSibling)
        eclist[i].previousSibling.style.display = 'none';

      }

    }
    //最后一个元素marginBottom为0
    if (this.comments.length > 0) {
      this.iframe.contentWindow.document.getElementById('EC-list').lastChild.style.marginBottom = '0';
    } else {
      this.iframe.contentWindow.document.getElementById('loadMore').style.display = 'none';
    }

    this.resizeForm();
  },
  buildHTML: function () {
    var self = this;
    var comments = self.comments.slice();
    //  console.log(comments)
    return comments.reduce(function (total, comment) {
      return total + comment.render();
    }, '');
  },
  loadMore: function (e) {
    // console.log('加载更多');
    // console.log('page: ' + this.page);

    if (this.haveMore) {
      this.page++;
      this.loadDataFromDB(this.triComment.site, this.triComment.originId, true);
    }

  },
  emojiClick: function (e) {

    this.DOM.bottomTarget = this.doc.getElementById('reply_bottom_target');
    this.DOM.emojiIcons = this.doc.getElementById('replyEmojiIcons');

    commonFunc.emojiClick(this, this.DOM.bottomTarget, this.DOM.emojiIcons, true, e);
    this.resizeForm();

  },
  replySubmit: function (id, e) {

    var comment = Object.create(Comment);
    var author = Object.create(Author);
    author.init(this.triComment.userid, this.triComment.username, this.triComment.avatar);
    // console.log(this.triComment) // 正常
    comment.init(author, this.DOM.replyTextarea.value, new Date().toString(), '', this.triComment.site, this.triComment.originId, id, {}, this.triComment);

    if (comment.validate(commonFunc.getCommentLength(this.DOM.replyTextarea.value.trim()), this.DOM.replyTextarea.value)) {
      this.upload2DB(comment);
    } else {
      let msg = commonFunc.showErrors(this, comment.errors);
      var Reply = this.doc.getElementById('reply');
      if (msg) {
        Reply.appendChild(msg);
      }
    }
    this.resizeForm();

  },

  emojiIconClick: function (e) {

    var element = this.DOM.replyTextarea;
    commonFunc.emojiIconClick(this, element, e)

  },

  targetClick: function (e) {
    commonFunc.targetClick(this, true, e);
  },

  onTextareaKeyup: function (e) {
    this.onTextareaMouseup();
  },

  // 光标位置获取
  onTextareaMouseup: function (e) {
    if (window.getSelection) {
      this.mouseindex = this.DOM.replyTextarea.selectionStart;
    }
  },

  // 评论
  upload2DB: function (comment) {
    var self = this;
    commonFunc.saveComment(self, comment).then(function (res) {
      // self.commentsList.comments.unshift(comment);
      console.log(res)

      self.DOM.replyTextarea.value = '';
      self.loadDataFromDB(self.triComment.site, self.triComment.originId, false);
      self.render(self.DOM.form);
    }).catch(function (res) {
      console.log(res)
      var error = [{
        field: 'text',
        message: '网络错误,评论失败~'
      }];
      // self.showErrors(error);
      return false;
    })
  },

  autoResizeHeight: function () {
    // console.log(this.DOM.replyTextarea.style.height)
    // console.log(this.DOM.replyTextarea.style.lineHeight)
    // console.log($(this.DOM.replyTextarea).width())
    // this.DOM.replyTextarea.style.height = 'auto';
    // if ((this.DOM.replyTextarea.scrollHeight + 2) !== parseInt(this.DOM.replyTextarea.style.height)) {
    this.DOM.replyTextarea.style.height = (this.DOM.replyTextarea.scrollHeight + 2) + 'px';
    // this.DOM.replyTextarea.style.height = this.DOM.replyTextarea.style.posHeight;
    // }
  },

  onTextareaFocus: function () {
    if ($(this.DOM.replyTextarea.parentNode.parentNode.lastChild).attr('class') === 'ec-error') {
      $(this.DOM.replyTextarea.parentNode.parentNode.lastChild).remove();
      this.err = [];
    }
  }

}


module.exports = CommentList;