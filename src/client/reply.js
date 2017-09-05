var Replay = {
  init: function(replay, triComment) {
    this.replay = replay;
    this.triComment = triComment;
  },

  render: function () {
    let _replayTemplate =
    "<div id='reply'>" +
      "<div id='textareaWrap'><textarea style='height: 32px; line-height: 20px; font-size: 12px;' id='replyTextarea' placeholder='回复 "+ this.replay +" : '></textarea><span draggable='true' id='dragBugle'></span></div>" +
      "<div id='ECFormButtonField'>" +
        "<div id='emoji' class='emoji'>" +
          "<ul class='ec-emojiList'>" +
            "<li><span id='ec-replay-emoji-face' class='ec-emoji ec-emoji-face'>表情</span></li>" +
          "</ul>" +
          "<div id='replyEmojiIcons' class='face-con'>" +
            "<div id='reply_bottom_target'>" +
              "<span class='active'><img class='emoji_target' style='width: 24px; height: 24px;' src= " + this.triComment.domain + "/static/images/laughing.png alt='imglog' title='target0'/></span>" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<input class='button' id='replySubmit' disabled='disabled' type='submit' value='评论'>" +
      "</div>" +
    "</div>"

    return _replayTemplate;
  }
}


module.exports = Replay;