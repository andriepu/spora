import axios from '~/api/modules/axios/--jira';

export default (key, comment) => comment.content.length &&
  axios.post(`/issue/${key}/comment`, {
    body: comment,
  });
