import axios from '~/api/modules/axios/--internal';

export default keys => axios.get('/jira/search', {
  params: { keys: keys.join(',') },
}).then(({ data }) => data.data);
