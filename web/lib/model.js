// const Browser = require('zombie');
// var model = {};

// var browser = new Browser({
//   maxWait: 10000,
//   silent: true
// });

// model.open = function (url, cb) {
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
var Horseman = require('node-horseman');

model.open = function(url, cb) {
  var horseman = new Horseman();
  if (['http', 'https'].indexOf(url.split(':')[0]) === -1) {
    url = 'http://' + url;
  }
  horseman
    .open(url)
    .html()
    .then(function(html){
      cb(html); 
    })
    .catch(err, function(err) {})
    .finally(function(){
      return horseman.close();
    })
    
}

module.exports = model;
