const axios = require('~/api/modules/axios/--confluence');
const extractGroomingDoc = require('~/api/utils/adf/extract-grooming-doc');

module.exports = (docId, issueKey) => axios.get(`/content/${docId}`, {
  params: { expand: 'ancestors,body.atlas_doc_format' },
}).then(({ data }) => (
  JSON.parse(data.body.atlas_doc_format.value)
)).then(groomingAdf => (
  extractGroomingDoc(groomingAdf)
)).then(groomingData => (
  groomingData.find(({ key }) => issueKey === key)
));
