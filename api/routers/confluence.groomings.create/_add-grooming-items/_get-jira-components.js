const axiosInternal = require('~/api/modules/axios/--internal');

module.exports = () => axiosInternal.get('/jira/projects/components')
  .then(({ data }) => (
    data.data.filter(({ name }) => !name.startsWith('@'))
  ));
