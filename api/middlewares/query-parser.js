import qs from 'qs';

export default (req, res, next) => {
  req.query = qs.parse(req._parsedUrl.query || '');
  next();
};
