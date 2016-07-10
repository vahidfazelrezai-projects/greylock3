const Browser = require('zombie');
var model = {};

var browser = new Browser();

model.open = function (url, cb) {
  if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
    url = 'http://' + url;
  }
  browser.visit(url, function(error) {
    cb(browser.html());
  });
}

module.exports = model;
