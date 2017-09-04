const axios = require('axios')
var Emoji = require('./create_emoji')
const Promise = require('promise-polyfill')

if (!window.Promise) {
  window.Promise = Promise;
}

exports.clearTag = (str) => {
  return str.replace(/<(?:.|\s)*?>/g, "").replace(/\s/g, "").replace(/[&nbsp;]/g, "");
}

exports.getCommentLength = (str) => {
  var len = str.length;
  return len;
}

// 错误信息显示
exports.showErrors = (_this, errors) => {
  _this.err.push(errors[0]);
  if (_this.err.length === 1) {
    console.log(_this.doc)
    var msg = _this.doc.createElement('div');
    var err = '<p>' + errors[0].message + '</p>';
    msg.innerHTML = err;
    msg.classList.add('ec-error');
    return msg;
  }

  return;
}

exports.saveComment = (_this, comment) => {
  var res = axios({
    method: 'POST',
    url: _this.triComment.domain + '/savecomment',
    data: {
      site: comment.site,
      originId: comment.originId,
      userid: comment.author.userid,
      name: comment.author.name,
      avater: comment.author.avatar,
      commentbody: comment.text.replace(/</g, '&lt;').replace(/>/g, '&gt').replace(/\n/g, '<br/>'),
      cite: comment.cite
    }
  })

  return res;
}

exports.targetClick = (_this, aoi, e) => {
  e.preventDefault();
  // console.log('dfdfdfdfdf:' + $(e.target).parent().index())
  // addEventListener($(e.target).parent().index())
  // 移除兄弟结点的class active
  $(e.target).parent().siblings().removeClass('active');
  // 添加当前节点class active
  $(e.target).parent().addClass('active');

  _this.emoji = Object.create(Emoji);
  // 移除之前节点
  $(_this.DOM.emojiIcons).find('.emojiList').remove();

  // console.log(_this.triComment) 正常

  _this.emoji.init($(e.target).parent().index(), _this.triComment);
  // 重新渲染表情框
  if (aoi) {
    _this.DOM.emojiIcons.appendChild(_this.emoji.DOM.emojiHtml);
  } else {
    _this.DOM.emojiIcons.insertBefore(_this.emoji.DOM.emojiHtml, _this.DOM.emojiIcons.childNodes[_this.DOM.emojiIcons.childNodes.length - 1]);
  }
  // 重新添加监听事件
  $(_this.emoji.DOM.emojiHtml).find('.face').on('click', _this.emojiIconClick.bind(_this));

  // console.log( $(this.DOM.emojiIcons).find('.emojiList') )

}

exports.emojiIconClick = (_this, element,  e, leftword=false) => {
  // console.log('emojiclick')
  e.preventDefault();

  var temp = e.target.outerHTML;

  /**
   * 输入框内的表情格式为[description]
   */
  var text = element.value;
  // console.log(this.DOM.ECFormField.innerHTML[this.mouseindex - 1]);
  // console.log('前：' + text.slice(0, this.mouseindex));
  // console.log('中：' + '[' + temp.firstChild.title + ']');
  // console.log('后：' + text.slice(this.mouseindex));
  element.value = text.slice(0, _this.mouseindex) + '[' + $(temp).attr('title') + ']' + text.slice(_this.mouseindex);

  // 隐藏表情框
  _this.DOM.emojiIcons.style.display = 'none';
  if (leftword) {
    _this.textLeft();
  }
  // this.textLeft();
  // console.log(this.mouseindex)
  // console.log((temp.firstChild.title.length + 2))
  _this.mouseindex += ($(temp).attr('title').length + 2);
  /**
   * bug: 点击表情，光标不见了
   */
  // 显示光标
  element.focus();
  if (window.getSelection) {
    element.selectionStart = element.selectionEnd = _this.mouseindex;
  } else if (document.selection) {
    var sel = element.createTextRange();
    sel.moveStart('character', _this.mouseindex);
    sel.moveEnd('character', _this.mouseindex);
    sel.collapse();
  }
}

/**
 * _this this指向
 * bottomTarget 表情框底部表情分类条包裹层
 * emojiIcons 表情框包裹层
 * aoi 是通过appendChild方式还是通过insertBefore加入DOM，由于表情框布局方式不同引起
 * e 点击事件
 */
exports.emojiClick = (_this, bottomTarget, emojiIcons, aoi, e) => {
  e.preventDefault();

  if (!_this.emoji) {
    _this.emoji = Object.create(Emoji);
    _this.emoji.init(0, _this.triComment);
    // console.log(_this.emoji.DOM.emojiHtml)
    if (aoi) {
      emojiIcons.appendChild(_this.emoji.DOM.emojiHtml);
    } else {
      emojiIcons.insertBefore(_this.emoji.DOM.emojiHtml, _this.DOM.emojiIcons.childNodes[_this.DOM.emojiIcons.childNodes.length - 1]);
    }

  }
  $(_this.emoji.DOM.emojiHtml).find('.face').off('click').on('click', _this.emojiIconClick.bind(_this));
  $(bottomTarget).find('span>img').on('click', _this.targetClick.bind(_this));
  // 点击其他隐藏
  $(_this.doc.body).on('click', (e) => {

    let condition;

    if (aoi) {
      condition = emojiIcons.style.display === 'block' && $(e.target).attr('id') !== 'ec-replay-emoji-face' && $(e.target).attr('class') !== 'emoji_target' && $(e.target).attr('class') !== 'face_wrap';
    } else {
      condition = emojiIcons.style.display === 'block' && $(e.target).attr('id') !== 'ec-emoji-face' && $(e.target).attr('class') !== 'emoji_target' && $(e.target).attr('class') !== 'face_wrap';
    }

    if (condition) {
      emojiIcons.style.display = 'none';
    }

  });
  // 展开表情框逻辑
  if (emojiIcons.style.display === 'block') {
    emojiIcons.style.display = 'none';
  } else {
    emojiIcons.style.display = 'block';
  }
}