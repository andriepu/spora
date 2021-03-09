import { checkValidToken } from '~/api/utils/token';

export default (req, res, next) => {
  if ([
    checkValidToken(req.cookies.token),
    checkValidToken(req.headers['x-token']),
  ].some(Boolean)) {
    next();
  } else {
    res.writeHead(401);
    res.end('Forbidden');
  }
};
