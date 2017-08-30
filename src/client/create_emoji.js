if (!global.$) global.$ = require('jquery');
if (!global.jQuery) global.jQuery = require('jquery');

var Emoji = {

init : function (targetIndex, triComment) {
  this.triComment = triComment;
  this.DOM = {};
  this.initDOM(targetIndex);
  if (targetIndex !== -2) {
  this.render();
  }
},

initDOM : function (index) {
  const emoji = [[
    {emojiName: '冷汗', emojiurl: this.triComment.domain + '/static/emoji-icons/0.gif'},
    {emojiName: '微笑', emojiurl: this.triComment.domain + '/static/emoji-icons/1.gif'},
    {emojiName: '龇牙', emojiurl: this.triComment.domain + '/static/emoji-icons/2.gif'},
    {emojiName: '偷笑', emojiurl: this.triComment.domain + '/static/emoji-icons/3.gif'},
    {emojiName: '色', emojiurl: this.triComment.domain + '/static/emoji-icons/4.gif'},
    {emojiName: '大笑', emojiurl: this.triComment.domain + '/static/emoji-icons/5.gif'},
    {emojiName: '得意', emojiurl: this.triComment.domain + '/static/emoji-icons/6.gif'},
    {emojiName: '抓狂', emojiurl: this.triComment.domain + '/static/emoji-icons/7.gif'},
    {emojiName: '鼓掌', emojiurl: this.triComment.domain + '/static/emoji-icons/8.gif'},
    {emojiName: '快哭了', emojiurl: this.triComment.domain + '/static/emoji-icons/9.gif'},
    {emojiName: '坏笑', emojiurl: this.triComment.domain + '/static/emoji-icons/10.gif'},
    {emojiName: '亲亲', emojiurl: this.triComment.domain + '/static/emoji-icons/11.gif'},
    {emojiName: '亲亲1', emojiurl: this.triComment.domain + '/static/emoji-icons/12.gif'},
    {emojiName: '酷', emojiurl: this.triComment.domain + '/static/emoji-icons/13.gif'},
    {emojiName: '害羞', emojiurl: this.triComment.domain + '/static/emoji-icons/14.gif'},
    {emojiName: '流口水', emojiurl: this.triComment.domain + '/static/emoji-icons/15.gif'},
    {emojiName: '思考', emojiurl: this.triComment.domain + '/static/emoji-icons/16.gif'},
    {emojiName: '疑问', emojiurl: this.triComment.domain + '/static/emoji-icons/17.gif'},
    {emojiName: '哈欠', emojiurl: this.triComment.domain + '/static/emoji-icons/18.gif'},
    {emojiName: '溴大了', emojiurl: this.triComment.domain + '/static/emoji-icons/19.gif'},
    {emojiName: '心碎', emojiurl: this.triComment.domain + '/static/emoji-icons/20.gif'},
    {emojiName: '爱心', emojiurl: this.triComment.domain + '/static/emoji-icons/21.gif'},
    {emojiName: '左哼哼', emojiurl: this.triComment.domain + '/static/emoji-icons/22.gif'},
    {emojiName: '抠鼻', emojiurl: this.triComment.domain + '/static/emoji-icons/23.gif'},
    {emojiName: '闭嘴', emojiurl: this.triComment.domain + '/static/emoji-icons/24.gif'},
    {emojiName: '难过', emojiurl: this.triComment.domain + '/static/emoji-icons/25.gif'},
    {emojiName: '晕', emojiurl: this.triComment.domain + '/static/emoji-icons/26.gif'},
    {emojiName: '汗', emojiurl: this.triComment.domain + '/static/emoji-icons/27.gif'},
    {emojiName: '加油', emojiurl: this.triComment.domain + '/static/emoji-icons/28.gif'},
    {emojiName: '流泪', emojiurl: this.triComment.domain + '/static/emoji-icons/29.gif'},
    {emojiName: '骷髅', emojiurl: this.triComment.domain + '/static/emoji-icons/30.gif'},
    {emojiName: '吐了', emojiurl: this.triComment.domain + '/static/emoji-icons/31.gif'},
    {emojiName: '擦汗', emojiurl: this.triComment.domain + '/static/emoji-icons/32.gif'},
    {emojiName: '发怒', emojiurl: this.triComment.domain + '/static/emoji-icons/33.gif'},
    {emojiName: '强', emojiurl: this.triComment.domain + '/static/emoji-icons/63.gif'},
    {emojiName: '弱', emojiurl: this.triComment.domain + '/static/emoji-icons/64.gif'},
    {emojiName: '握手', emojiurl: this.triComment.domain + '/static/emoji-icons/65.gif'},
    {emojiName: '耶', emojiurl: this.triComment.domain + '/static/emoji-icons/66.gif'},
    {emojiName: '抱拳', emojiurl: this.triComment.domain + '/static/emoji-icons/67.gif'},
    {emojiName: '勾引', emojiurl: this.triComment.domain + '/static/emoji-icons/68.gif'},
    {emojiName: '好的', emojiurl: this.triComment.domain + '/static/emoji-icons/69.gif'},
    {emojiName: '不', emojiurl: this.triComment.domain + '/static/emoji-icons/70.gif'},
    {emojiName: '玫瑰', emojiurl: this.triComment.domain + '/static/emoji-icons/71.gif'},
    {emojiName: '焉了', emojiurl: this.triComment.domain + '/static/emoji-icons/72.gif'},
    {emojiName: '吻', emojiurl: this.triComment.domain + '/static/emoji-icons/73.gif'},
    {emojiName: '亲亲', emojiurl: this.triComment.domain + '/static/emoji-icons/74.gif'},
    {emojiName: '飞吻', emojiurl: this.triComment.domain + '/static/emoji-icons/75.gif'},
    {emojiName: '抱抱', emojiurl: this.triComment.domain + '/static/emoji-icons/52.gif'},
    {emojiName: '晚安', emojiurl: this.triComment.domain + '/static/emoji-icons/53.gif'},
    {emojiName: '太阳', emojiurl: this.triComment.domain + '/static/emoji-icons/54.gif'},
    {emojiName: '炸弹', emojiurl: this.triComment.domain + '/static/emoji-icons/55.gif'},
    {emojiName: '骷髅', emojiurl: this.triComment.domain + '/static/emoji-icons/56.gif'},
    {emojiName: '菜刀', emojiurl: this.triComment.domain + '/static/emoji-icons/57.gif'},
    {emojiName: '猪头', emojiurl: this.triComment.domain + '/static/emoji-icons/58.gif'},
    {emojiName: '西瓜', emojiurl: this.triComment.domain + '/static/emoji-icons/59.gif'},
    {emojiName: '奶茶', emojiurl: this.triComment.domain + '/static/emoji-icons/60.gif'},
    {emojiName: '米饭', emojiurl: this.triComment.domain + '/static/emoji-icons/61.gif'},
    {emojiName: '爱心', emojiurl: this.triComment.domain + '/static/emoji-icons/62.gif'}
        ],[],[]]

  this.DOM.emoji = emoji;

  if (index !== -2) {
      var _html = ''
    for (var i = 0; i < emoji[index].length; i++) {
      _html += '<li><span class="face_wrap"><img class="face ' + emoji[index][i].emojiName + '" src="' + emoji[index][i].emojiurl + '" alt="' + emoji[index][i].emojiName + '" title="' + emoji[index][i].emojiName + '" /></span></li>';   
    }
    this.DOM.emojiHtml = $("<ul style='list-style: none' id='emojiList' class='emojiList'>" + _html + "</ul>").get(0);
  }
},

render: function () {
  return this.DOM;
}

}

module.exports = Emoji;