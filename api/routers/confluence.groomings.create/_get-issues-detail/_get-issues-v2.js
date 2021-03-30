const axiosV2 = require('~/api/modules/axios/--jira--v2');
const customfields = require('~/api/constants/customfields');

const { PROJECT_KEY } = process.env;

module.exports = issueKeys => axiosV2.get('/search', {
  params: {
    jql: `project="${PROJECT_KEY}" AND key in (${issueKeys}) ORDER BY RANK`,
    fields: Object.keys(customfields).map(k => customfields[k]).join(','),
  },
}).then(({ data }) => data.issues);
