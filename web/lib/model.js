var model = {};

model.open = function (url) {
  if (!(url.split(':')[0] in ['http', 'https'])) {
    url = 'http://' + url;
  }
  return url;
}

module.exports = model;
