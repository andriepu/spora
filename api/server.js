import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import queryParser from './middlewares/query-parser';
import responseJson from './middlewares/response-json';
import apiGuard from './middlewares/api-guard';

import routers from './routers';

const app = express();

[
  cookieParser(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  queryParser,
  responseJson,
  apiGuard,
].forEach((middleware) => {
  app.use(middleware);
});

routers.forEach(([base, router]) => {
  app.use(base, router);
});

export default {
  path: '/api',
  handler: app,
};
