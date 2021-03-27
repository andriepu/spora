const axios = require('~/api/modules/axios/--internal');

module.exports = () => axios.get('/jira/projects/components')
  .then(({ data }) => data.data);
