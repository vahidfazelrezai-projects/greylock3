cheerio = require('cheerio');
fs = require('fs');
path = require('path');
request = require('request');
imagemin = require('imagemin');
imageminMozjpeg = require('imagemin-mozjpeg');
imageminPngquant = require('imagemin-pngquant');
juice = require('juice');


var cleaner = {};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var download = function(uri, filename, callback){
    console.log("downloading image");
    request.head(uri, function(err, res, body){
        console.log("downloaded image", err);
        if (err) {
            console.log("ERROR:", err);
            callback(null);
            return;
        }
        console.log(err);
        type = res.headers['content-type'];
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {callback(type)});
    });
};

PARSE_URL = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

isValidURL = function(s) {
   index = s.lastIndexOf("/");
   if (index > -1) {
        return s.substring(0, index).indexOf(".") > -1;
   }
   return false;
}

returnBase = function(parts) {
    ret = "";
    if (parts[1] !== undefined) {
        ret += parts[1] + ":" + parts[2];
    }
    ret += parts[3];
    if (parts[4] !== undefined) {
        ret += ':' + parts[4];
    } 
    return ret;
}

cleaner.clean = function (html, url, cb) {
    var $ = cheerio.load(html);
    console.log($)
    images = $('img');
    processImage = function(i) {
        if (i === images.length) {
            links = $('link');
            processLink = function(j) {
                if (j === links.length) {
                    console.log("ON LAST LINK");  
                    $('script').remove();
                    fs.readFile(path.resolve(__dirname, '../client/lighten.js'), 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        $('head').append("\n<script>\n" + data + "\n</script>\n");
                        options = {preserveFontFaces: false};
                        try {
                            var res = juice($.html(), options);
                            cb(res);
                        } catch(e) {
                            console.log("error with juice", e);
                            cb($.html());
                        }
                    });
                    return;
                }
                link = links[j];
                href = $(link).attr('href');
                console.log(href);
                if (href !== undefined) {
                  if (href.indexOf(".css") > -1) {
                      parts = PARSE_URL.exec(url);
                      base = returnBase(parts);
                      if (base.indexOf("http") !== 0) {
                          base = "http://" + base;
                      }
                      if (!isValidURL(href)) {
                          console.log("isnt valid url, new url is", base + "/" + href);
                          href = base + "/" + href;
                      }
                      if (href.indexOf("./") === 0) {
                          href = base + "/" + href.substring(2);
                      }

                      // yay its css
                      request.get(href, function (error, response, body) {
                          console.log("error downloading:", error);
                          if (!error && response.statusCode == 200) {
                              style = body;
                              // Continue with your processing here.
                          } else {
                              style = "";
                          }
                          $('head').append("\n<style>\n" + style + "\n</style>\n");
                          console.log("appended");
                          $(link).remove();
                          processLink(j + 1);
                      });
                    } else {
                      processLink(j+1);
                    }
                } else {
                    $(link).remove();
                    processLink(j + 1);
                }
            }
            processLink(0);
            return;
        }

        elem = images[i];
        src = $(elem).attr('src')
        console.log(i, src);

        if (src !== undefined) {

          if (!isValidURL(src)) {
              parts = PARSE_URL.exec(url);
              base = returnBase(parts);
              if (base.indexOf("http") !== 0) {
                  base = "http://" + base;
              }
              console.log("isnt valid url, new url is", base + "/" + src);
              src = base + "/" + src;
          }

          if (src.indexOf("//") === 0) {
              src = "http:" + src;
          }

          file = "image-" + src.split("/").pop();

          download(src, file, function(type){
              if (!type) {
                  processImage(i+1);
              } else {
                  imagemin([file], 'build/images', {
                      plugins: [
                          imageminMozjpeg({quality: 10}),
                          imageminPngquant({quality: '0-20', speed: 10})
                      ]
                  }).then(files => {
                      console.log("compressed image", type);
                      pref = "data:" + type + ";base64,";
                      imData = files[0]['data'].toString('base64');
                      $(elem).attr('src', pref + imData);
                      processImage(i+1);
                  });
              }
          });
        } else {
          $(elem).attr('src') = "";
          processImage(i+1);
        }
    }
    processImage(0);    
}

module.exports = cleaner;
