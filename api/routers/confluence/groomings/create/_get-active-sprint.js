import axios from '~/api/modules/axios/--internal';

export default () => axios.get('/jira/sprints', {
  params: { state: 'active' },
}).then(({ data }) => data);
