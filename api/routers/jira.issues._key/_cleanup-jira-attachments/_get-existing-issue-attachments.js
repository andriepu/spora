const axiosJira = require('~/api/modules/axios/--jira');

module.exports = issueKey => axiosJira.get(`/issue/${issueKey}`, {
  params: { fields: 'attachment' },
}).then(({ data }) => data.fields.attachment);
