const axios = require('~/api/modules/axios/--jira');

module.exports = (key, comment) => comment.content.length &&
  axios.post(`/issue/${key}/comment`, {
    body: comment,
  });
