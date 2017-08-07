var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');
var Author = require('./author.js');

var Form = {

  init: function (iframe) {
    this.iframe = iframe; 
    this.DOM = {};
    this.initDOM(this.iframe);
    this.fields = this.DOM.form.getElementsByTagName('form')[0].elements;

    // 创建评论列表实例
    this.commentsList = Object.create(CommentList);

    // 
    this.commentsList.init(this.DOM.form, this.renderCallback);

    // 创建一个author实例
    this.author = Object.create(Author);

    // 初始化author实例
    this.author.fetch();

    // 添加事件监听，提交按钮的提交点击， 文本框的focus事件触发
    this.addEventListeners();

    // 设置form尺寸
    this.resize();
  },

  addEventListeners: function () {
    this.DOM.form.addEventListener('submit', this.onClick.bind(this));
    this.fields['text'].addEventListener('focus', this.onTextareaFocus.bind(this));
  },

  resize: function () {
    var formHeight = this.DOM.form.clientHeight;
    var margin = parseInt(window.getComputedStyle(this.DOM.form).marginBottom);
    var num = formHeight + margin + this.commentsList.getHeight() + 20;
    this.iframe.style.height = num + 'px'; 
  },

  initDOM: function () {
    this.doc = this.iframe.contentWindow.document;
    this.doc.write(_formTemplate);
    this.doc.close();
    this.DOM.form = this.doc.getElementById('ECForm');
    this.DOM.button = this.doc.getElementById('ECFormSubmit');
  },

  submit: function () {
    var comment = Object.create(Comment);
    // this.author.init(this.fields['name'].value, this.fields['email'].value.trim());
    // 初始化用户的用户名、邮箱
    this.author.init(this.fields['name'].value, this.fields['email'].value.trim());    

    // 初始化新增的评论
    comment.init(this.author, this.fields['text'].value, new Date().toString());
    if (comment.validate()) {
      // 验证新增评论有效，则把该评论加入评论列表
      this.commentsList.comments.push(comment);

      // 把新增的评论加入localStorage
      this.commentsList.save();


      this.commentsList.render(this.DOM.form);
      this.author.save();
      this.clear();
    } else {
      this.showErrors(comment.errors);
    }
    this.resize();
  },

  // 错误信息显示
  showErrors: function (errors) {
    errors.forEach(function(error) {
      var msg = this.doc.createElement('p');
      msg.innerHTML = error.message;
      msg.classList.add('ec-error');
      this.fields[error.field].parentNode.appendChild(msg);
    }.bind(this));
  },

  // 文本框获取焦点转台触发事件
  onTextareaFocus: function (e) {
    var fields = this.DOM.form.querySelectorAll('.ec-form__fields');
    fields[0].style.display = 'block';
    ['name', 'email'].forEach(function(property) {
      this.fields[property].value = this.author[property] || '';
    }.bind(this));
    this.resize();
  },

  clear: function () {
    ['text', 'name', 'email'].forEach(function(field) {
      this.fields[field].value = '';
    }.bind(this));
  },

  onClick: function (e) {
    e.preventDefault();
    this.submit();
  }

};

var _formTemplate = 
  "<div id='ECForm' class='ec-form-wrapper'>" + 
    "<h2 class='ec-heading--2' id='ECFormHeading'></h2>" + 
    "<form class='ec-form'>" + 
      "<div class='ec-form__field' id='ECForm-text'>" +
        "<textarea class='' name='text' id='ECFormField' placeholder='Your comment...'>" +
        "</textarea>" + 
      "</div>" + 
      "<div class='ec-form__fields'>" + 
        "<div class='ec-form__field' id='ECForm-author'>" + 
          "<input class='' type='text' name='name' placeholder='Name'>" +
        "</div>" +
        "<div class='ec-form__field' id='ECForm-email'>" + 
          "<input class='' type='email' name='email' placeholder='Email'>" +
        "</div>" +
        "<div class=''>" + 
          "<input class='button' id='ECFormSubmit' type='submit' value='Submit comment'>" + 
        "</div>" + 
      "</div>" +
    "</form>" + 
  "</div>";

module.exports = Form;
