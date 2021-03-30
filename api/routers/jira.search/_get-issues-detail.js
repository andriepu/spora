const axiosJira = require('~/api/modules/axios/--jira');
const customfields = require('~/api/constants/customfields');

const { PROJECT_KEY } = process.env;

module.exports = issueKeys => axiosJira.get('/search', {
  params: {
    jql: `project="${PROJECT_KEY}" AND key in (${issueKeys}) ORDER BY RANK`,
    fields: Object.keys(customfields).map(k => customfields[k]).join(','),
  },
}).then(({ data }) => data);
