const axios = require('~/api/modules/axios/--internal');

module.exports = () => axios.get('/jira/board', {
  params: { state: 'active' },
}).then(({ data }) => data.data);
