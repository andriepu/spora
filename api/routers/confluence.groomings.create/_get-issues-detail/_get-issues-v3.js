const axiosInternal = require('~/api/modules/axios/--internal');

module.exports = issueKeys => axiosInternal.get('/jira/search', {
  params: { keys: issueKeys.join(',') },
}).then(({ data }) => data.data);
