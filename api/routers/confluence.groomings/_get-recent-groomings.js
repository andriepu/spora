const axios = require('~/api/modules/axios/--confluence');

const { CONFLUENCE_GROOMING_PARENT_ID } = process.env;

module.exports = () => {
  const limit = 5;

  return axios.get(`/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`)
    .then(({ data }) => (
      data.results
        .slice(-limit)
        .map(({ id, title }) => ({ id, title }))
        .reverse()
    ));
};
