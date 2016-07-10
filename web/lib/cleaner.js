const cheerio = require('cheerio');
fs = require('fs');
path = require('path');

var cleaner = {};

cleaner.clean = function (html, cb) {
  var $ = cheerio.load(html);
  $('img').remove();

  fs.readFile(path.resolve(__dirname, '../client/lighten.js'), 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    $('head').append("\n<script>\n" + data + "\n</script>\n")
    cb($.html());
  });
}

module.exports = cleaner;
