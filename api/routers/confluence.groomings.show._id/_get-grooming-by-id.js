const axios = require('~/api/modules/axios/--confluence');

module.exports = docId => axios.get(`/content/${docId}`, {
  params: { expand: 'ancestors,body.atlas_doc_format' },
}).then(({ data }) => data);
