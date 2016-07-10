// PACKAGES //
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

// PROCESSOR //
var model = require('./lib/model');
var cleaner = require('./lib/cleaner');

// APP //
var app = express();
var port = '5000';

// VIEW ENGINE //
app.set('view engine', 'html');
app.engine('html', function(path, options, callback) {
  fs.readFile(path, 'utf-8', callback);
});

// MIDDLEWARE //
app.use(morgan('dev')); // logger
app.use(express.static(__dirname + '/client')); // set static folder
app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({ extended: true })); // parse forms

// ROUTES //
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.post('/event', function (req, res) {
  console.log(req.body);
  res.send('got it')
});

app.get('/*', function (req, res) {
  var url = req.path.substring(1);
  model.open(url, function (html) {
    cleaner.clean(html, function(cleanedHtml) {
      res.send(cleanedHtml);
    });
  });
});

// RUN APP //
app.use(function(err, req, res, next) { res.status(err.status || 500); });
app.listen(port, function() {
  console.log("running on port:" + port);
});
