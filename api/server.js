const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { API_BASEPATH } = require('~/api/constants/comms');

const queryParser = require('./middlewares/query-parser');
const resUtil = require('./middlewares/res');
const apiGuard = require('./middlewares/api-guard');

const routers = require('./routers');

const app = express();

[
  cookieParser(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  queryParser,
  resUtil,
  apiGuard,
].forEach((middleware) => {
  app.use(middleware);
});

app.use('/', routers);

module.exports = {
  path: API_BASEPATH,
  handler: app,
};
