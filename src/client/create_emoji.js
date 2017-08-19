const $  = require('jquery')

var Emoji = {

    init : function (targetIndex) {

        this.DOM = {};
        this.initDOM(targetIndex);
        if (targetIndex !== -2) {
            this.render();
        }
    },

    initDOM : function (index) {

        // console.log(this.DOM)

        const emoji = [[
            {emojiName: '冷汗', emojiurl: window.triComment.domain + '/static/emoji-icons/0.gif'},
            {emojiName: '微笑', emojiurl: window.triComment.domain + '/static/emoji-icons/1.gif'},
            {emojiName: '龇牙', emojiurl: window.triComment.domain + '/static/emoji-icons/2.gif'},
            {emojiName: '偷笑', emojiurl: window.triComment.domain + '/static/emoji-icons/3.gif'},
            {emojiName: '色', emojiurl: window.triComment.domain + '/static/emoji-icons/4.gif'},
            {emojiName: '大笑', emojiurl: window.triComment.domain + '/static/emoji-icons/5.gif'},
            {emojiName: '得意', emojiurl: window.triComment.domain + '/static/emoji-icons/6.gif'},
            {emojiName: '抓狂', emojiurl: window.triComment.domain + '/static/emoji-icons/7.gif'},
            {emojiName: '鼓掌', emojiurl: window.triComment.domain + '/static/emoji-icons/8.gif'},
            {emojiName: '快哭了', emojiurl: window.triComment.domain + '/static/emoji-icons/9.gif'},
            {emojiName: '坏笑', emojiurl: window.triComment.domain + '/static/emoji-icons/10.gif'},
            {emojiName: '亲亲', emojiurl: window.triComment.domain + '/static/emoji-icons/11.gif'},
            {emojiName: '亲亲1', emojiurl: window.triComment.domain + '/static/emoji-icons/12.gif'},
            {emojiName: '酷', emojiurl: window.triComment.domain + '/static/emoji-icons/13.gif'},
            {emojiName: '害羞', emojiurl: window.triComment.domain + '/static/emoji-icons/14.gif'},
            {emojiName: '流口水', emojiurl: window.triComment.domain + '/static/emoji-icons/15.gif'},
            {emojiName: '思考', emojiurl: window.triComment.domain + '/static/emoji-icons/16.gif'},
            {emojiName: '疑问', emojiurl: window.triComment.domain + '/static/emoji-icons/17.gif'},
            {emojiName: '哈欠', emojiurl: window.triComment.domain + '/static/emoji-icons/18.gif'},
            {emojiName: '溴大了', emojiurl: window.triComment.domain + '/static/emoji-icons/19.gif'},
            {emojiName: '心碎', emojiurl: window.triComment.domain + '/static/emoji-icons/20.gif'},
            {emojiName: '爱心', emojiurl: window.triComment.domain + '/static/emoji-icons/21.gif'},
            {emojiName: '左哼哼', emojiurl: window.triComment.domain + '/static/emoji-icons/22.gif'},
            {emojiName: '抠鼻', emojiurl: window.triComment.domain + '/static/emoji-icons/23.gif'},
            {emojiName: '闭嘴', emojiurl: window.triComment.domain + '/static/emoji-icons/24.gif'},
            {emojiName: '难过', emojiurl: window.triComment.domain + '/static/emoji-icons/25.gif'},
            {emojiName: '晕', emojiurl: window.triComment.domain + '/static/emoji-icons/26.gif'},
            {emojiName: '汗', emojiurl: window.triComment.domain + '/static/emoji-icons/27.gif'},
            {emojiName: '加油', emojiurl: window.triComment.domain + '/static/emoji-icons/28.gif'},
            {emojiName: '流泪', emojiurl: window.triComment.domain + '/static/emoji-icons/29.gif'},
            {emojiName: '骷髅', emojiurl: window.triComment.domain + '/static/emoji-icons/30.gif'},
            {emojiName: '吐了', emojiurl: window.triComment.domain + '/static/emoji-icons/31.gif'},
            {emojiName: '擦汗', emojiurl: window.triComment.domain + '/static/emoji-icons/32.gif'},
            {emojiName: '发怒', emojiurl: window.triComment.domain + '/static/emoji-icons/33.gif'}
        ],[
            {emojiName: '擦汗', emojiurl: window.triComment.domain + '/static/emoji-icons/32.gif'},
            {emojiName: '发怒', emojiurl: window.triComment.domain + '/static/emoji-icons/33.gif'}
        ],[
            {emojiName: '加油', emojiurl: window.triComment.domain + '/static/emoji-icons/28.gif'},
            {emojiName: '流泪', emojiurl: window.triComment.domain + '/static/emoji-icons/29.gif'}
        ]]

        this.DOM.emoji = emoji;

        if (index !== -2) {
            var _html = ''

            for (var i = 0; i < emoji[index].length; i++) {

                _html += '<li><span><img class="face ' + emoji[index][i].emojiName + '" src="' + emoji[index][i].emojiurl + '" alt="' + emoji[index][i].emojiName + '" title="' + emoji[index][i].emojiName + '" /></span></li>';
                
            }
            

        this.DOM.emojiHtml = $("<ul style='list-style: none' id='emojiList' class='emojiList'>" + _html + "</ul>").get(0);

        }
    },

    render: function () {

        return this.DOM;

    }

}

module.exports = Emoji;