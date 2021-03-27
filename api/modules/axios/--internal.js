const { merge } = require('lodash');
const axios = require('axios');
const { TOKEN_HEADER, API_BASEPATH } = require('~/api/constants/comms');
const { generateToken } = require('~/api/utils/token');

const { PORT } = process.env;

const instance = axios.create({
  baseURL: new URL(API_BASEPATH, `http://localhost:${PORT}`).href,
});

instance.interceptors.request.use(config => merge(
  config,
  { headers: { [TOKEN_HEADER]: generateToken() } },
));

module.exports = instance;
