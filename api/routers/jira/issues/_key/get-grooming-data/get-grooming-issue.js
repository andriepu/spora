import axios from '~/api/modules/axios/--confluence';
import extractGroomingDoc from '~/api/utils/adf/extract-grooming-doc';

export default (docId, issueKey) => axios.get(`/content/${docId}`, {
  params: { expand: 'ancestors,body.atlas_doc_format' },
}).then(({ data }) => (
  JSON.parse(data.body.atlas_doc_format.value)
)).then(groomingAdf => (
  extractGroomingDoc(groomingAdf)
)).then(groomingData => (
  groomingData.find(({ key }) => issueKey === key)
));
