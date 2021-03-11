import axios from '~/api/modules/axios/--internal';

export default () => axios.get('/jira/board', {
  params: { state: 'active' },
}).then(({ data }) => data.data);
