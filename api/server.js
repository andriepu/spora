import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { API_BASEPATH } from '~/api/constants/comms';

import queryParser from './middlewares/query-parser';
import resUtil from './middlewares/res';
import apiGuard from './middlewares/api-guard';

import routers from './routers';

const app = express();

[
  cookieParser(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  queryParser,
  resUtil,
  // apiGuard,
].forEach((middleware) => {
  app.use(middleware);
});

app.use('/', routers);

export default {
  path: API_BASEPATH,
  handler: app,
};
