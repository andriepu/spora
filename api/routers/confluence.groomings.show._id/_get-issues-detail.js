const axios = require('~/api/modules/axios/--internal');

module.exports = keys => axios.get('/jira/search', {
  params: { keys: keys.join(',') },
}).then(({ data }) => (
  data.data
));
