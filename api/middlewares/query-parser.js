const qs = require('qs');

module.exports = (req, res, next) => {
  req.query = qs.parse(req._parsedUrl.query || '');
  next();
};
