var Comment = require('./comment.js');
var Author = require('./author.js');
var axios = require('axios')
var Emoji = require('./create_emoji.js');
var Reply = require('./reply.js')
const config = require('../../config/server.js')


var CommentList = {

  init: function (form, renderCallback, iframe, triComment) {
    this.DOM = {};
    this.triComment = triComment;
    this.mouseindex = 0;

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

  addEventListener: function () {
    var self = this;
    $(this.loadmore).on('click', this.loadMore.bind(this));
    //添加删除评论事件
    var ECList = self.iframe.contentWindow.document.getElementById("EC-list");

    ECList.addEventListener('click', function (e) {
      var item = e.target;
      // console.log(item.tagName)
      // 删除
      if (item.tagName === 'I' && item.getAttribute('class').indexOf('delete') !== -1) {
        var modal = window.top.document.querySelector('#deleteComModal');
        $(modal).modal('show');
        $(modal.getElementsByTagName('button')[1]).off('click').on('click', function () {
          item.parentNode.parentNode.parentNode.previousSibling.firstChild.src = self.triComment.domain + '/static/images/demo.png';
          item.parentNode.parentNode.nextSibling.innerText = '该评论已删除';
          item.parentNode.parentNode.nextSibling.style.fontSize = "14px";
          item.parentNode.parentNode.nextSibling.style.color = "#c5c5c5";
          // console.log(item.parentNode.parentNode)
          item.parentNode.parentNode.style.display = "none";
          self.deleteComment(item.getAttribute('data-id'));
          self.resizeForm();
        })

      }

      // 回复
      if (item.tagName === 'I' && item.getAttribute('class').indexOf('replay') !== -1) {

        // 移除其他
        if ($(item.parentNode.parentNode.parentNode.lastChild).attr('id') !== 'reply' && self.iframe.contentWindow.document.getElementById('reply')) {
         $(self.iframe.contentWindow.document.getElementById('reply')).remove();
         self.emoji = '';
        }

        // 加在当下
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

          self.DOM.dragBugle = self.doc.getElementById('dragBugle');
          // 给文本框增加resize事件
          self.DOM.dragBugle.onmousedown = function (event) {
            var event = event || window.event;
            var _pageY = event.pageY || event.clientY + document.documentElement.scrollTop;

            $(self.doc).on('mousemove', function (event){
              var event = event || window.event;
              var pageY = event.pageY || event.clientY + self.doc.documentElement.scrollTop;
              var disY = pageY - _pageY;
              // 改变——pageY
              _pageY = pageY;
              var height = parseInt(self.DOM.replyTextarea.style.height) + disY;
              if (height < 32) {
                height = 32;
              }
              self.DOM.replyTextarea.style.height = height + 'px';
              self.resizeForm();
            })

            $(self.doc).on('mouseup',function () {
              $(self.doc).off('mousemove');
              $(self.doc).off('mouseup');
            })
          }
        }

        self.resizeForm()

      }

    }, false);

    var ReplyDiv = self.iframe.contentWindow.document.getElementById("reply");

  },

  loadDataFromDB: function (site, originId, load) {
    var self = this;

    // 重置page
    if (!load) {
      self.page = 1;
    }

    axios.get(self.triComment.domain + '/getcomments?site=' + site + '&originId=' + originId + '&page=' + this.page).then(function (res) {

      // 加载更多
      // 显示加在更多
      if (self.loadmore.style.display === 'none') {
        self.loadmore.style.display = 'block';
      }

      if (res.data.length > 0 && load) {
        self.comments = self.comments.concat(self.load(res.data));
      } else if (!load) {
        self.comments = self.load(res.data);
      }
      if (res.data.length < 10) {
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
    this.iframe.contentWindow.document.querySelectorAll(".delete").forEach(function (ele, index) {
      // console.log(window.triComment.userid)
      // console.log(userid[index].author.userid)
      var isCommentUser = self.triComment.userid === userid[index].author.userid ? true : false;
      // console.log('isAuthor: ' + isAuthor)
      // console.log('isCommentUser: ' + isCommentUser)
      // var delete = ele.lastChild.
      if (!isAuthor && !isCommentUser) {
        ele.style.display = 'none';
      } else if (self.triComment.userid === '') {
        ele.style.display = 'none';
      }
      var delContentDiv = ele.parentNode.parentNode.nextSibling;
      if (delContentDiv.innerText === '该评论已删除') {
        delContentDiv.parentNode.previousSibling.firstChild.src = self.triComment.domain + '/static/images/demo.png';
        delContentDiv.style.fontSize = '14px';
        delContentDiv.style.color = '#c5c5c5';
        ele.parentNode.parentNode.style.display = 'none';
      }
    });
    this.resizeForm();
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

      num += (parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).height() + parseInt($(this.list).find('.ec-comment').eq(index).css('padding-bottom')) + 1)
      // console.log((parseInt($(this.list).find('.ec-comment').eq(index).css('margin-bottom')) + $(this.list).find('.ec-comment').eq(index).height() + parseInt($(this.list).find('.ec-comment').eq(index).css('padding-bottom')) + 1))
      // console.log('padding: ' + parseInt($(this.list).find('.ec-comment').eq(index).css('padding-bottom')))
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

      if (this.form.nextSibling.nextSibling.style.display === 'block') {

        num += ($(this.form.nextSibling.nextSibling).height() + parseInt($(this.form.nextSibling.nextSibling).css('margin-top')))

      }

    }

    if (this.form.nextSibling.style.display === 'block' && $(this.form.nextSibling).attr('id') === 'blank') {

      num += ($(this.form.nextSibling).height() + parseInt($(this.form.nextSibling).css('margin-top')))

      // console.log('marginTop: ' + parseInt($(this.form.nextSibling).css('margin-top')))
      // console.log("comment_list中的blank的高度: " + $(this.form.nextSibling).height())

    }

    num += ($(this.loadmore).height() + parseInt($(this.loadmore).css('margin-top')))

    // console.log('加载更多高度：' + ($(this.loadmore).height() + parseInt($(this.loadmore).css('margin-top'))))

    // 加上上面的输入框高度和body的padding值和margin值
    num += formHeight + margin + 42;
    this.iframe.style.height = num + 10 + 'px';
    // this.overlay.style.height = num + 10 + 'px';

    // console.log('iframe高度：' + this.iframe.style.height)

  },
  load: function (data) {
    var self = this;
    return data.map(function (ele) {
      var a = Object.create(Author);
      a.init(ele.userid, ele.username, ele.avatar);
      var c = Object.create(Comment);
      // console.log(self.triComment) //正常
      c.init(a, ele.content, ele.timestamp, ele._id, self.triComment.site, self.triComment.originId, ele._cite, self.triComment);
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
    var i = this.iframe.contentWindow.document.getElementById("EC-list").querySelectorAll('i');

    // 游浏览器兼容性问题
    // console.log(navigator.userAgent.match('/mobile/i'))
    if (navigator.userAgent.match('/mobile/i')) {
      i.forEach(function (i) {
        i.style.display = 'block';
      })
    }

    // console.log($(this.iframe.contentWindow.document.getElementById("EC-list")).find('.ec-content'))
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
  getHeight: function () {
    return this.list.clientHeight;
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
    // console.log(1)
    e.preventDefault();
    this.DOM.bottomTarget = this.doc.getElementById('reply_bottom_target');
    this.DOM.emojiIcons = this.doc.getElementById('replyEmojiIcons');
    if (!this.emoji) {
      this.emoji = Object.create(Emoji);
      this.emoji.init(0, this.triComment);
      // console.log(this.emoji.DOM.emojiHtml)
      this.DOM.emojiIcons.appendChild(this.emoji.DOM.emojiHtml);
    }
    $(this.emoji.DOM.emojiHtml).find('.face').off('click').on('click', this.emojiIconClick.bind(this));
    $(this.DOM.bottomTarget).find('span>img').on('click', this.targetClick.bind(this));
    // 点击其他隐藏
    $(this.doc.body).on('click', (e) => {
      if (this.DOM.emojiIcons.style.display === 'block' && $(e.target).attr('id') !== 'ec-replay-emoji-face' && $(e.target).attr('class') !== 'emoji_target' && $(e.target).attr('class') !== 'face_wrap') {
        this.DOM.emojiIcons.style.display = 'none';
      }
    });
    // 展开表情框逻辑
    if (this.DOM.emojiIcons.style.display === 'block') {
      this.DOM.emojiIcons.style.display = 'none';
    } else {
      this.DOM.emojiIcons.style.display = 'block';
    }
    this.resizeForm();

    // 显示提交按钮
    // var fields = this.DOM.form.querySelectorAll('.ec-form__fields');
    // fields[0].style.display = 'block';

  },
  replySubmit: function (id, e) {
    console.log(this.DOM.replyTextarea.value)
    console.log(id)

    var comment = Object.create(Comment);
    var author = Object.create(Author);
    author.init(this.triComment.userid, this.triComment.username, this.triComment.avatar);
    // console.log(this.triComment) // 正常
    comment.init(author, this.DOM.replyTextarea.value, new Date().toString(), '', this.triComment.site, this.triComment.originId, id, this.triComment);

    this.upload2DB(comment);

  },

  emojiIconClick: function (e) {
    var self = this;
    e.preventDefault();
    /**
     * bug: 表情只能添加在后面
     */
    //console.log('鼠标的位置：'+this.DOM.ECFormField.selectionStart);
    var temp = e.target.outerHTML;
    // console.log($(temp).attr('title'))
    /**
     * 输入框内的表情格式为[description]
     */
    var text = this.DOM.replyTextarea.value;
    // console.log(this.DOM.ECFormField.innerHTML[this.mouseindex - 1]);
    // console.log('前：' + text.slice(0, this.mouseindex));
    // console.log('中：' + '[' + temp.firstChild.title + ']');
    // console.log('后：' + text.slice(this.mouseindex));
    this.DOM.replyTextarea.value = text.slice(0, this.mouseindex) + '[' + $(temp).attr('title') + ']' + text.slice(this.mouseindex);

    // 隐藏表情框
    this.DOM.emojiIcons.style.display = 'none';
    // this.textLeft();
    // console.log(this.mouseindex)
    // console.log((temp.firstChild.title.length + 2))
    this.mouseindex += ($(temp).attr('title').length + 2);
    /**
     * bug: 点击表情，光标不见了
     */
    // 显示光标
    this.DOM.replyTextarea.focus();
    if (window.getSelection) {
      this.DOM.replyTextarea.selectionStart = this.DOM.replyTextarea.selectionEnd = this.mouseindex;
    } else if (document.selection) {
      var sel = this.DOM.replyTextarea.createTextRange();
      sel.moveStart('character', this.mouseindex);
      sel.moveEnd('character', this.mouseindex);
      sel.collapse();
    }

  },

  targetClick: function (e) {
    e.preventDefault();
    // console.log('dfdfdfdfdf:' + $(e.target).parent().index())
    // addEventListener($(e.target).parent().index())
    // 移除兄弟结点的class active
    $(e.target).parent().siblings().removeClass('active');
    // 添加当前节点class active
    $(e.target).parent().addClass('active');

    this.emoji = Object.create(Emoji);
    // 移除之前节点
    $(this.DOM.emojiIcons).find('.emojiList').remove();

    // console.log(this.triComment) 正常

    this.emoji.init($(e.target).parent().index(), this.triComment);
    // 重新渲染表情框
    this.DOM.emojiIcons.appendChild(this.emoji.DOM.emojiHtml);
    // 重新添加监听事件
    $(this.emoji.DOM.emojiHtml).find('.face').on('click', this.emojiIconClick.bind(this));

    // console.log( $(this.DOM.emojiIcons).find('.emojiList') )

  },

  onTextareaKeyup: function (e) {
    var self = this;
    self.onTextareaMouseup();
  },

  // 光标位置获取不对
  onTextareaMouseup: function (e) {
    if (window.getSelection) {
      this.mouseindex = this.DOM.replyTextarea.selectionStart;
    }
  },

  upload2DB: function (comment) {
    var self = this;
    axios({
      method: 'POST',
      url: self.triComment.domain + '/savecomment',
      data: {
        site: comment.site,
        originId: comment.originId,
        userid: comment.author.userid,
        name: comment.author.name,
        avater: comment.author.avatar,
        commentbody: comment.text.replace(/</g, '&lt;').replace(/>/g, '&gt').replace(/\n/g, '<br/>'),
        cite: comment.cite
      }
    }).then(function (res) {
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
  }

}


module.exports = CommentList;