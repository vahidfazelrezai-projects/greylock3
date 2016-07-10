const Browser = require('zombie');
var model = {};

var browser = new Browser({
  maxWait: 10000,
  silent: true
});

model.open = function (url, cb) {
  if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
    url = 'http://' + url;
  }
  browser.visit(url, function() {
    if (browser.error) {}
    browser.wait(function() {
      if (browser.error) {}
      cb(browser.html());
    });
  })
}

module.exports = model;
