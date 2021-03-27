const { flatten } = require('lodash');
const { filter } = require('@atlaskit/adf-utils/traverse');
const axios = require('~/api/modules/axios/--jira');

module.exports = key => axios.get(`/issue/${key}/comment`)
  .then(({ data }) => {
    const { comments } = data;

    return flatten(comments.map(({ body }) => (
      filter(body, node => node.type === 'listItem')
    )));
  });
