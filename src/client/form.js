var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');
var Author = require('./author.js');
var Emoji = require('./create_emoji.js');
var axios = require('axios');
const commonFunc = require('./commonFunc.js')

const config = require('../../config/server.js');

var hasBootstrap = false;
var topScripts = window.top.document.querySelectorAll('script');

for (var topScripts_i = 0; topScripts_i < topScripts.length; topScripts_i++) {
  if (topScripts[topScripts_i].src &&
    (topScripts[topScripts_i].src.indexOf('bootstrap.js') !== -1 ||
    topScripts[topScripts_i].src.indexOf('bootstrap.min.js') !== -1)) {
    hasBootstrap = true;
  }
}
if (!hasBootstrap) {
  var bootstrap = require('bootstrap');
}

if (!window.top.jQuery) {
  var jquery = require('jquery');

} else {
  window.$ = window.jQuery = window.top.jQuery;
}


var Form = {

  init: function (iframe, triComment) {
    // console.log(triComment)
    this.iframe = iframe;
    this.triComment = triComment
    // console.log("form: " + this.triComment)
    this.DOM = {};
    this.initDOM(this.iframe);
    /**
     * 报错出现的问题：此处的elements只能找到表单元素例如input
     */
    this.field = this.DOM.form.getElementsByTagName('form')[0];
    // 创建评论列表实例
    this.commentsList = Object.create(CommentList);
    // console.log('1' + this.triComment)
    this.commentsList.init(this.DOM.form, this.renderCallback, iframe, this.triComment);

    // 创建一个author实例
    this.author = Object.create(Author);

    // 添加事件监听，提交按钮的提交点击， 文本框的focus事件触发
    this.addEventListeners(0);

    // 设置form尺寸
    this.resize();
    this.err = [];

    // 记录光标的位置
    this.mouseindex = 0;

  },

  addEventListeners: function (index) {

    this.DOM.form.addEventListener('submit', this.onClick.bind(this));
    this.DOM.emojiFace.addEventListener('click', this.emojiClick.bind(this));
    this.DOM.ECFormField.addEventListener('mouseup', this.onTextareaMouseup.bind(this));
    this.DOM.ECFormField.addEventListener('keyup', this.onTextareaKeyup.bind(this));
    this.DOM.ECFormField.addEventListener('focus', this.onTextareaFocus.bind(this));
    this.DOM.ECFormField.addEventListener('focusout', this.onTextareaFocusout.bind(this));
    this.DOM.ECFormField.addEventListener('input', this.textLeft.bind(this));

  },

  resize: function () {

    this.commentsList.resizeForm()
  },

  initDOM: function (iframe) {

    this.doc = iframe.contentWindow.document;
    this.DOM.emojiList = this.doc.getElementById('emojiList');
    if (!this.doc.getElementById('ECForm')) {
      this.doc.write(this.renderFormTemplate());
    }

    // 判断是否有相关库文件，没有的话自动引入
    let hasCss = false;

    var head = window.top.document.getElementsByTagName('head')[0];
    var link = window.top.document.querySelectorAll('link');

    // 判断是否存在bootstrap css
    for (var link_i = 0; link_i < link.length; link_i++){
      if ((link[link_i].href).indexOf('bootstrap.min.css') !== -1) {
        hasCss = true;
      }
    }

    if (!hasCss) {
      var linkTag = document.createElement('link');
      linkTag.href = this.triComment.domain + '/static/bootstrap/css/bootstrap.min.css';
      linkTag.setAttribute('rel','stylesheet');
      linkTag.setAttribute('type','text/css');
      head.appendChild(linkTag);
    }

    if (!window.top.document.getElementById('deleteComModal')) {
        var _div = document.createElement('div');
        _div.innerHTML = modalTemplate;
        window.top.document.body.appendChild(_div);
    }
    var linkTag = document.createElement('link');
    linkTag.href = this.triComment.domain + '/ios.css';
    linkTag.setAttribute('rel','stylesheet');
    linkTag.setAttribute('type','text/css');
    head.appendChild(linkTag);


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

    this.author.init(this.triComment.userid, this.triComment.username, this.triComment.avatar);
    // console.log(this.triComment) // 正常
    comment.init(this.author, this.DOM.ECFormField.value, new Date().toString(), '', this.triComment.site, this.triComment.originId, '', {}, this.triComment);
    // if (comment.validate(this.getCommentLength(this.clearTag((this.DOM.ECFormField.value).toString())),this.DOM.ECFormField.value,window.triComment.commentable)) {
    if (comment.validate(this.getCommentLength(this.DOM.ECFormField.value.trim()), this.DOM.ECFormField.value)) {
      this.upload2DB(comment);
      this.DOM.WordLeft.innerText = 140;
    } else {
      var msg = commonFunc.showErrors(this, comment.errors);
      var Blank = this.doc.getElementById('blank');
      if (msg) {
        this.DOM.form.style.paddingBottom = '0';
        this.DOM.form.style.height = ($(this.DOM.form).get(0).offsetHeight - 20) + 'px';
        Blank.parentNode.insertBefore(msg, Blank);
      }
    }
    this.resize();
  },

  upload2DB: function (comment) {
    var self = this;
    commonFunc.saveComment(self, comment).then(function (res) {
      // self.commentsList.comments.unshift(comment);
      console.log(res)
      self.clear();
      self.commentsList.loadDataFromDB(self.triComment.site, self.triComment.originId, false);
      self.commentsList.render(self.DOM.form);
    }).catch(function (res) {
      console.log(res)
      var error = [{
        field: 'text',
        message: '网络错误,评论失败~'
      }];
      var msg = commonFunc.showErrors(self, error);
      var Blank = self.doc.getElementById('blank');
      if (msg) {
        self.DOM.form.style.paddingBottom = '0';
        self.DOM.form.style.height = ($(self.DOM.form).get(0).offsetHeight - 20) + 'px';
        Blank.parentNode.insertBefore(msg, Blank);
      }
      self.resize();
      return false;
    })
  },

  getCommentLength(ihtml) {
    var len = ihtml.length;
    return len;
  },

  onTextareaKeyup: function (e) {
    var self = this;
    self.onTextareaMouseup();
  },

  // 光标位置获取不对
  onTextareaMouseup: function (e) {
    if (window.getSelection) {
      this.mouseindex = this.DOM.ECFormField.selectionStart;
    }
  },

  // 文本框获取焦点转台触发事件
  onTextareaFocus: function (e) {
    var fields = this.DOM.form.querySelector('.ec-form__field');
    fields.style.borderColor = '#90c16f';
    var warn = this.DOM.blank.previousSibling;
    // console.log(warn);
    // console.log(warn.nextSibling.className);

    // console.log('warn:(focus)' + warn);
    if (warn.className === 'ec-error') {
      warn.style.display = 'none';
      //这里需要清空err数组的内容
      this.err = [];
      warn.remove();
      this.DOM.form.style.paddingBottom = '20px';
      this.DOM.form.style.height = ($(this.DOM.form).get(0).offsetHeight + 20) + 'px';
    }

    this.resize();
  },
  // 文本框失去焦点转台触发事件
  onTextareaFocusout: function (e) {
    var fields = this.DOM.form.querySelector('.ec-form__field');
    fields.style.borderColor = '#c5c5c5';

    var warn = document.getElementsByClassName('ec-error')[0];
    // console.log('           warn:' + warn);
    if (warn) {
      warn.style.display = 'none';
    }

    this.resize();

  },

  textLeft: function () {
    var len = this.getCommentLength(this.DOM.ECFormField.value.trim());

    if (len > 0) {
      this.DOM.button.removeAttribute('disabled');
    } else {
      this.DOM.button.setAttribute('disabled', 'disabled');
    }

    var left = 140 - len;
    this.DOM.WordLeft.innerText = left;
  },

  clear: function () {
    this.DOM.ECFormField.value = ''
  },

  onClick: function (e) {
    e.preventDefault();
    this.submit();
  },

  emojiClick: function (e) {

    commonFunc.emojiClick(this, this.DOM.bottomTarget, this.DOM.emojiIcons, false, e);
    this.resize();

  },

  emojiIconClick: function (e) {

    var element = this.DOM.ECFormField;
    commonFunc.emojiIconClick(this, element, e, true);

  },

  targetClick: function (e) {
    commonFunc.targetClick(this, false, e);
  },

  renderFormTemplate: function () {
    var _formTemplate =
    "<div style='height: 194px; padding: 20px; box-sizing: border-box;' id='ECForm' class='ec-form-wrapper'>" +
      "<form class='ec-form'>" +
        "<div class='ec-form__field' id='ECForm-text'>" +
          "<textarea style='height: 98px;' contenteditable='true' class='' name='text' id='ECFormField' placeholder='我有话说...'>" +
          "</textarea>" +
          "<div id='wordLeft' style='height: 24px;'>还可以输入<span id='wordLeftNum'>140</span>字</div>" +
          "<div style='height: 29px; box-sizing: border-box;' id='ECFormButtonField'>" +
            "<div id='emoji' class='emoji'>" +
              "<ul class='ec-emojiList'>" +
                "<li><span id='ec-emoji-face' class='ec-emoji ec-emoji-face'>表情</span></li>" +
              "</ul>" +
              "<div id='emojiIcons' class='face-con'>" +
                "<div id='bottom_target'>" +
                  "<span class='active'><img class='emoji_target' style='width: 24px; height: 24px;' src=" + this.triComment.domain + "/static/images/laughing.png alt='imglog' title='target0'/></span>" +
                  // "<span><img class='emoji_target' style='width: 24px; height: 24px;' src=" + window.triComment.domain + "/static/images/tusiji.png alt='imglog' title='target1'/></span>" +
                  // "<span><img class='emoji_target' style='width: 24px; height: 24px;' src=" + window.triComment.domain + "/static/images/man.png alt='imglog' title='target2'/></span>" +
                "</div>" +
              "</div>" +
            "</div>" +
            "<input class='button' disabled='disabled' id='ECFormSubmit' type='submit' value='评论'>" +
          "</div>" +
        "</div>" +
      "</form>" +
    "</div>" +
    "<div id='blank' style='margin: 0;'><img style='height: 98px; margin-top: 50px;' src=" + this.triComment.domain + "/static/images/blank.png><p style='height: 24px; line-height: 24px; margin-top: 20px'>暂时还没有评论..</p></div>";

    return _formTemplate;
  }

};

var modalTemplate =
  "<div style='display: none' class='modal fade' id='deleteComModal' tebindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
    "<div class='modal-dialog'>" +
      "<div class='modal-content'>" +
        "<div style='border-bottom: none;' class='modal-header'>" +
          "<button type='button' data-dismiss='modal' aria-label='关闭' class='close'></button> " +
          "<h4 class='modal-title'>确认操作</h4>" +
        "</div>" +
      "<div class='modal-body'><p>确认删除该评论吗？</p></div> " +
      "<div style='border-top: none;' class='modal-footer'>" +
        "<button data-dismiss='modal' class='btn btn-danger' id='deleteCom'>确定删除</button> " +
        "<button data-dismiss='modal' class='btn btn-default'>取消</button>" +
      "</div>" +
    "</div>" +
  "</div>";

  module.exports = Form;
