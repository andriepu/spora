const { sprintf } = require('sprintf-js');
const axiosInternal = require('~/api/modules/axios/--internal');
const { GROOMING_TITLE } = require('~/api/constants/variables');

module.exports = () => axiosInternal.get('/jira/board', {
  params: { state: 'active' },
}).then(({ data }) => sprintf(GROOMING_TITLE, data.data.name));
