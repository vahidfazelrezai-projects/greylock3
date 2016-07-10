const cheerio = require('cheerio')
var cleaner = {};

cleaner.clean = function (html, cb) {
  var $ = cheerio.load(html);
  $('img').remove();
  $('script').remove();
  cb($.html());
}

module.exports = cleaner;
