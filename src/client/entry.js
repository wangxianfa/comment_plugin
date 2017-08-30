EchoChamber = (function (window, undefined) {

  window.EchoChamber = window.EchoChamber || {};


  EchoChamber.discussionURL = window.location;


  // EchoChamber.host = hosts.prod;
  EchoChamber.App = require('./echo_chamber.js');

  return EchoChamber.App;

})(window);


$.extend({
  triComment: EchoChamber
})