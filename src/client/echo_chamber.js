var CommentList = require('./comment_list.js');
var Form = require('./form.js');


function App(triComment) {
  this.triComment = triComment;
  this.entry = document.getElementById('echochamber');


  this.container = document.createElement('div');
  this.container.className = 'demo-iframe-holder';
  this.container.id = 'CommentContainer';

  this.attachIframe = attachIframe;
  this.loadStylesheet = loadStylesheet;
  this.addEventListeners = addEventListeners;
  this.reload = reload;
  this._applyPageStyles = _applyPageStyles;
  this._getStyle = _getStyle;
  this._getBasicStyles = _getBasicStyles;
  this._debounce = _debounce;


  this.attachIframe();
  
  this.iframeDoc = this.container.firstChild.contentWindow.document;
  this.pageStyles = this._getBasicStyles(this.entry.parentNode);
  this.form = Object.create(Form);
  // console.log(this.iframe)
  // console.log("echo: " + this.triComment)
  this.iframe = this.container.firstChild;
  this.form.init(this.iframe, this.triComment);
  // this.form.init(this.iframe);
  this.loadStylesheet();

}

// iframe生成，以及为iframe添加包裹层
function attachIframe() {
  this.container.style.position = 'relative';
  this.container.style.overflow = 'auto';
  this.container.style.zIndex = '1';
  this.container.style.webkitOverflowScrolling = 'touch';
  this.iframe = document.createElement('iframe');
  this.iframe.style.width = '100%';
  this.iframe.id = 'tricom';
  this.iframe.style.overflow = 'hidden';
  this.iframe.style.border = "none";
  this.iframe.style.opacity = 0;
  this.iframe.setAttribute("scrolling", 'no');
  this.iframe.setAttribute("allowtransparency", true);
  this.iframe.style.transition = "opacity .5s";
  this.iframe.setAttribute("horizontalscrolling", "no");
  this.iframe.setAttribute("verticalscrolling", "no");
  this.entry.parentNode.insertBefore(this.container, this.entry);
  this.container.innerHTML = this.iframe.outerHTML;
  // this.entry.parentNode.insertBefore(this.iframe, this.entry);
}

function loadStylesheet() {
  var link = document.createElement('link'),
    img = document.createElement("img"),
    body = document.body,
    head = this.iframeDoc.getElementsByTagName('head')[0],
    // css文件
    cssURL = this.triComment.domain + '/main.css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssURL;
  head.appendChild(link);
  body.appendChild(img);
  img.src = cssURL;
  img.onerror = function () {
    body.removeChild(img);
    this._applyPageStyles(this.iframeDoc, this.pageStyles);
    this.iframe.style.opacity = 1;
    this.addEventListeners();
  }.bind(this);
}

function addEventListeners() {
  this.form.resize.bind(this.form)
  var self = this;
  this.iframe.contentWindow.addEventListener('resize', this.form.resize.bind(this.form));
}

function reload(triComment) {
  this.CommentList = Object.create(CommentList);
  const form = this.iframe.contentWindow.document.getElementById('ECForm');
  this.form.triComment = triComment;
  // console.log(this.iframe)
  // console.log(this.form)
  this.CommentList.init(form, this.renderCallback, this.iframe, triComment)
}

function _applyPageStyles(doc, styles) {
  var body = doc.getElementsByTagName('body')[0];
  for (var property in styles) {
    if (!styles.hasOwnProperty(property)) {
      return;
    }
    body.style[property] = styles[property];
  }
  var buttons = doc.getElementsByTagName("button");
  var paragraphs = doc.getElementsByTagName('p');
  var bgColor;
  for (var i = 0; i < buttons.length; i++) {
    //buttons[i].style['background-color'] = styles.anchorColor;
  }
};

function _getStyle(node, property) {
  var value;
  value = window.getComputedStyle(node, null).getPropertyValue(property);
  if (value === '' || value === 'transparent' || value === 'rgba(0,0,0,0)') {
    return this._getStyle(node.parentNode, property);
  } else {
    return value || '';
  }
};

function _getBasicStyles(container) {
  var anchor = document.createElement('a');
  var paragraph = document.createElement('p');
  container.appendChild(anchor);
  container.appendChild(paragraph);
  var styles = {
    anchorColor: this._getStyle(anchor, 'color'),
    paragraphColor: this._getStyle(paragraph, 'color'),
    fontFamily: this._getStyle(container, 'font-family').replace(/['"]/g, '')
  }
  anchor.parentNode.removeChild(anchor);
  paragraph.parentNode.removeChild(paragraph);
  return styles;
};

function _debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = App;