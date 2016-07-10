const cheerio = require('cheerio')
var cleaner = {};

cleaner.clean = function (html, cb) {
  var $ = cheerio.load(html);
  $('img').remove()
  cb($.html());
}

module.exports = cleaner;
