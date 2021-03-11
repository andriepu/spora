import axios from '~/api/modules/axios/--internal';

export default () => axios.get('/jira/projects/components')
  .then(({ data }) => data.data);
