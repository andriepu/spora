const axiosJira = require('~/api/modules/axios/--jira');

module.exports = (key, comment) => comment.content.length &&
  axiosJira.post(`/issue/${key}/comment`, {
    body: comment,
  });
