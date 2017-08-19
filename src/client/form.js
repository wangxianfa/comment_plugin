var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');
var Author = require('./author.js');
var Emoji = require('./create_emoji.js');
var axios = require('axios')
const config = require('../../config/server.js')

const $ = require('jquery');

var Form = {

  init: function (iframe) {
    this.iframe = iframe;
    this.DOM = {};
    this.initDOM(this.iframe);
    /**
     * 报错出现的问题：此处的elements只能找到表单元素例如input
     */
    this.field = this.DOM.form.getElementsByTagName('form')[0];
    // 创建评论列表实例
    this.commentsList = Object.create(CommentList);
    this.commentsList.init(this.DOM.form, this.renderCallback, iframe);

    // 创建一个author实例
    this.author = Object.create(Author);

    // 添加事件监听，提交按钮的提交点击， 文本框的focus事件触发
    this.addEventListeners(0);

    //用户登录判断,禁止评论
    // if (!window.triComment.username || window.triComment.username.length == 0) {
    //   $(this.DOM.ECFormField).attr('contenteditable', 'false');
    //   $(this.DOM.button).attr('disabled', 'true');
    //   $(this.DOM.emojiFace).unbind();
    // }
    // 设置form尺寸
    this.resize();
    this.err = [];
    // console.log(this.iframe.contentWindow.document.getElementById('delete'));
  },

  addEventListeners: function (index) {
    this.emoji = Object.create(Emoji);
    this.emoji.init(index);

    this.DOM.form.addEventListener('submit', this.onClick.bind(this));
    this.DOM.emojiFace.addEventListener('click', this.emojiClick.bind(this));
    // this.DOM.emojiIcons.appendChild(this.emoji.DOM.emojiHtml);
    this.DOM.emojiIcons.insertBefore(this.emoji.DOM.emojiHtml, this.DOM.emojiIcons.childNodes[this.DOM.emojiIcons.childNodes.length - 1]);

    // console.log('form中Icons的高度：' + $(this.DOM.emojiIcons).height())
    // console.log('form中的表情框的高度：' + $(this.emoji.DOM.emojiHtml).height())
    $(this.emoji.DOM.emojiHtml).find('.face').on('click', this.emojiIconClick.bind(this));
    // this.DOM.ECFormField.addEventListener('mouseup', this.onTextareaMouseup.bind(this));
    this.DOM.ECFormField.addEventListener('focus', this.onTextareaFocus.bind(this));
    this.DOM.ECFormField.addEventListener('focusout', this.onTextareaFocusout.bind(this));
    this.DOM.ECFormField.addEventListener('input', this.textLeft.bind(this));


    $(this.DOM.bottomTarget).find('span>img').on('click', this.targetClick.bind(this));


    $(this.doc.body).on('click', (e) => {

      if (this.DOM.emojiIcons.style.display === 'block' && $(e.target).attr('id') !== 'ec-emoji-face' && $(e.target).attr('class') !== 'emoji_target') {

        this.DOM.emojiIcons.style.display = 'none';

      }

    });

  },

  resize: function () {

    this.commentsList.resizeForm()

  },

  initDOM: function (iframe) {

    this.doc = iframe.contentWindow.document;
    this.DOM.emojiList = this.doc.getElementById('emojiList');
    this.doc.write(_formTemplate);
    this.doc.close();
    this.DOM.form = this.doc.getElementById('ECForm');
    // console.log(this.DOM.form)
    this.DOM.ECFormField = this.doc.getElementById('ECFormField');
    this.DOM.button = this.doc.getElementById('ECFormSubmit');
    this.DOM.emojiFace = this.doc.getElementById('ec-emoji-face');
    this.DOM.WordLeft = this.doc.getElementById('wordLeftNum');
    this.DOM.emojiIcons = this.doc.getElementById('emojiIcons');
    this.DOM.bottomTarget = this.doc.getElementById('bottom_target');
    this.DOM.blank = this.doc.getElementById('blank');
  },

  submit: function () {
    var comment = Object.create(Comment);
    // this.author.init(this.fields['name'].value, this.fields['email'].value.trim());
    this.author.init(window.triComment.username,window.triComment.avatar);
    comment.init(this.author, this.DOM.ECFormField.innerHTML, new Date().toString(),id = '',window.triComment.site,window.triComment.originId);
    if (comment.validate(this.getCommentLength(this.DOM.ECFormField.innerHTML))) {
      this.upload2DB(comment);
    } else {
      this.showErrors(comment.errors);
    }
    this.resize();
  },

  upload2DB: function (comment) {
    var self = this;
    axios({
      method: 'POST',
      url: window.triComment.domain + '/savecomment',
      data: {
        site : comment.site,
        originId : comment.originId,
        name : comment.author.name,
        avater : comment.author.avatar,
        commentbody : comment.text
      }
    }).then(function(res) {
        self.commentsList.comments.unshift(comment);
        self.commentsList.render(self.DOM.form);
        self.clear();
        self.commentsList.loadDataFromDB(window.triComment.site, window.triComment.originId);
    }).catch(function(res) {
      var error = [{
      field: 'text',
      message: '网络错误,评论失败~'
      }];
      self.showErrors(error);
      return false;
    })
  },
  getCommentLength(ihtml) {
    var len = 0;
    len += ihtml.length;
    if(ihtml.match(/\[/g)!= null) {
      len -= ihtml.match(/\[/g).length*3;
    }
    return len;
  },
  // 错误信息显示
  showErrors: function (errors) {
    this.err.push(errors[0]);
    if (this.err.length === 1) {
      var msg = this.doc.createElement('div');
      var err = '<p>' + errors[0].message + '</p>';
      msg.innerHTML = err;
      msg.classList.add('ec-error');
      var Blank = this.doc.getElementById('blank');
      Blank.parentNode.insertBefore(msg, Blank);
      this.resize();
    }

  },
  // onTextareaMouseup: function () {
  //   var selection = this.DOM.ECFormField.getSelection();
  //   console.log('开始的位置：' + selection.anchorOffset);
  //   console.log('结束的位置：' + selection.focusOffset);
  // },

  // 文本框获取焦点转台触发事件
  onTextareaFocus: function (e) {
    var fields = this.DOM.form.querySelector('.ec-form__field');
    fields.style.borderColor = '#90c16f';
    var warn = this.DOM.form.nextSibling;
    // console.log(this.DOM.form.nextSibling.className);
    // console.log('warn:(focus)' + warn);
    if (warn.className === 'ec-error') {
      warn.style.display = 'none';
      //这里需要清空err数组的内容
      this.err = [];
      warn.remove();
    }

    this.resize();
  },
  // 文本框失去焦点转台触发事件
  onTextareaFocusout: function (e) {
    var fields = this.DOM.form.querySelector('.ec-form__field');
    fields.style.borderColor = '#c5c5c5';
    /**
     * problem: 这里无法获取警告
     */
    var warn = this.iframe.contentWindow.document.getElementsByClassName('ec-error')[0];
    // console.log('           warn:' + warn);
    if (warn) {
      warn.style.display = 'none';
    }

    this.resize();
  },

  textLeft: function () {
   var len = this.getCommentLength(this.DOM.ECFormField.innerHTML);
   var left = 140 - len;
   if (left <= 0) {
     left = 0;
   }
   this.DOM.WordLeft.innerText = left;
  },

  clear: function () {
    this.DOM.ECFormField.innerHTML = ''
  },

  onClick: function (e) {
    e.preventDefault();
    this.submit();
  },

  emojiClick: function (e) {
    e.preventDefault();

    // 展开表情框逻辑
    if (this.DOM.emojiIcons.style.display === 'block') {

      this.DOM.emojiIcons.style.display = 'none';

    } else {

      this.DOM.emojiIcons.style.display = 'block';

    }

    this.resize();

    // 显示提交按钮
    // var fields = this.DOM.form.querySelectorAll('.ec-form__fields');
    // fields[0].style.display = 'block';



  },

  emojiIconClick: function (e) {

    e.preventDefault();
    //console.log(e.target.outerHTML)
    //console.log(typeof e.target.outerHTML)
    //console.log(window.getSelection())

    // this.fields['text'].value += '[/' + e.target.attributes.title.value + ']';
    /**
     * bug: 表情只能添加在后面
     */
    //console.log('鼠标的位置：'+this.DOM.ECFormField.selectionStart);
    var temp = document.createElement('img');
    temp.innerHTML += e.target.outerHTML;
    // console.log(temp)
    //console.log(temp.firstChild.title);
    //this.DOM.ECFormField.innerHTML += e.target.outerHTML;
    /**
     * 输入框内的表情格式为[description]
     */
    this.DOM.ECFormField.innerHTML += '[' + temp.firstChild.title + ']';
    // 隐藏表情框
    this.DOM.emojiIcons.style.display = 'none';

    // 显示提交按钮
    // var fields = this.DOM.form.querySelectorAll('.ec-form__fields');
    // fields[0].style.display = 'block';
    this.textLeft();
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
    this.emoji.init($(e.target).parent().index());
    // 重新渲染表情框
    this.DOM.emojiIcons.insertBefore(this.emoji.DOM.emojiHtml, this.DOM.emojiIcons.childNodes[this.DOM.emojiIcons.childNodes.length - 1]);
    // 重新添加监听事件
    $(this.emoji.DOM.emojiHtml).find('.face').on('click', this.emojiIconClick.bind(this));

    // console.log( $(this.DOM.emojiIcons).find('.emojiList') )

  }

};



var _formTemplate =
  "<div style='height: 154px' id='ECForm' class='ec-form-wrapper'>" +
    "<span class='ec-heading--2' id='ECFormHeading'></span>" +
    "<form class='ec-form'>" +
      "<div class='ec-form__field' id='ECForm-text'>" +
        "<div contenteditable='true' class='' name='text' id='ECFormField' placeholder='我有话说...'>" +
        "</div>" +
        "<div id='wordLeft'>还可以输入<span id='wordLeftNum'>140</span>字</div>" +
        "<div id='ECFormButtonField'>" +
          "<div id='emoji' class='emoji'>" +
            "<ul class='ec-emojiList'>" +
              "<li><span id='ec-emoji-face' class='ec-emoji ec-emoji-face'><img src=>表情</span></li>" +
            "</ul>" +
            "<div style='display: none' id='emojiIcons' class='face-con'>" +
              "<div id='bottom_target'>" +
                "<span class='active'><img class='emoji_target' style='width: 24px; height: 24px;' src=" + window.triComment.domain + "/static/images/laughing.png alt='imglog' title='target0'/></span>" +
                "<span><img class='emoji_target' style='width: 24px; height: 24px;' src=" + window.triComment.domain + "/static/images/tusiji.png alt='imglog' title='target1'/></span>" +
                "<span><img class='emoji_target' style='width: 24px; height: 24px;' src=" + window.triComment.domain + "/static/images/man.png alt='imglog' title='target2'/></span>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<input class='button' id='ECFormSubmit' type='submit' value='评论'>" +
        "</div>" +
      "</div>" +
    "</form>" +
  "</div>" +
  "<div id='blank' style='margin-top: 50px'><img style='height: 98px' src=" + window.triComment.domain + "/static/images/blank.png><p style='height: 24px; line-height: 24px; margin-top: 20px'>暂时还没有评论..</p></div>";

module.exports = Form;
