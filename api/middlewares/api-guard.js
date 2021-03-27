const { TOKEN_HEADER } = require('~/api/constants/comms');
const { checkValidToken } = require('~/api/utils/token');

module.exports = (req, res, next) => {
  if ([
    checkValidToken(req.cookies.token),
    checkValidToken(req.headers[TOKEN_HEADER]),
  ].some(Boolean)) {
    next();
  } else {
    res.writeHead(401);
    res.end('Forbidden');
  }
};
