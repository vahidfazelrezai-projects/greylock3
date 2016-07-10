const Browser = require('zombie');
var model = {};

var browser = new Browser();

model.open = function (url, cb) {
  if (!(url.split(':')[0] in ['http', 'https'])) {
    url = 'http://' + url;
  }
  browser.visit(url, function(error) {
    cb(browser.html());
  });
}

module.exports = model;
