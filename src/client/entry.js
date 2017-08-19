var EchoChamber = (function (window, undefined) {
  window.EchoChamber = window.EchoChamber || {};
  var $ = require('jquery');

  (function() {
      window.EchoChamber.discussionURL = window.location;
  })();

  var EchoChamber = window.EchoChamber || {};

  EchoChamber.discussionURL = window.location;
  // var hosts = {
  //   local: 'http://widget.dev/src',
  //   prod: 'https://s3.amazonaws.com/echochamberjs/dist'
  // }

  // EchoChamber.host = hosts.prod;
  EchoChamber.App = require('./echo_chamber.js');

  var app = Object.create(EchoChamber.App);
  app.init();

  return app;

})(window);