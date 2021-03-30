const { pick } = require('lodash');
const axiosJira = require('~/api/modules/axios/--jira');

const { PROJECT_KEY } = process.env;

module.exports = () => axiosJira.get(`/project/${PROJECT_KEY}/components`)
  .then(({ data }) => (
    data.map(component => pick(component, [
      'self',
      'id',
      'name',
      'description',
    ]))
  ));
