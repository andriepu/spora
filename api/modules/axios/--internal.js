import { merge } from 'lodash';
import axios from 'axios';
import { TOKEN_HEADER, API_BASEPATH } from '~/api/constants/comms';
import { generateToken } from '~/api/utils/token';

const { PORT } = process.env;

const instance = axios.create({
  baseURL: new URL(API_BASEPATH, `http://localhost:${PORT}`).href,
});

instance.interceptors.request.use(config => merge(
  config,
  { headers: { [TOKEN_HEADER]: generateToken() } },
));

export default instance;
