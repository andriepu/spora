import axios from 'axios';
import qs from 'qs';

const {
  ATLASSIAN_USERNAME,
  ATLASSIAN_PASSWORD,
  JIRA_URL,
} = process.env;

export default axios.create({
  baseURL: new URL('/rest/agile/1.0', JIRA_URL).href,
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: ATLASSIAN_USERNAME,
    password: ATLASSIAN_PASSWORD,
  },
  paramsSerializer: params => (
    qs.stringify(params, {
      arrayFormat: 'repeat',
    })
  ),
});
