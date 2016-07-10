const Browser = require('zombie');
var model = {};

var browser = new Browser();

model.open = function (url, cb) {
  browser.visit(url, function(error) {
    cb(browser.html());
  });
}

module.exports = model;
