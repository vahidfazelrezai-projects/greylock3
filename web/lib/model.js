const Browser = require('zombie');
var model = {};

var browser = new Browser();

model.open = function (url, cb) {
  if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
    url = 'http://' + url;
  }
  browser.visit(url, function(err) {
    if (err) {} // suppress errors from websites' code
    browser.wait().then( function() {
      cb(browser.html());
    });
  });
}

module.exports = model;
