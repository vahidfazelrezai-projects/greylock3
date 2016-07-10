// const Browser = require('zombie');
// var model = {};

// var browser = new Browser({
//   maxWait: 10000,
//   silent: true
// });

// model.open = function (url, cb) {
//   console.log(browser);
//   if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
//     url = 'http://' + url;
//   }
//   browser.visit(url, function() {
//     if (browser.error) {}
//     browser.wait(function() {
//       if (browser.error) {}
//       cb(browser.html());
//     });
//   })
// }

// module.exports = model;

var model = {};
var phantom = require('phantom');
var _ph, _page, _outObj;

model.open = function(url, cb) {
  if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
    url = 'http://' + url;
  }
  phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
  }).then(page => {
    _page = page;
    return _page.open(url);
  }).then(status => {
    return _page.property('content')
  }).then(content => {
    console.log(content);
    cb(content);
    _page.close();
    _ph.exit();
  });
}

module.exports = model;
