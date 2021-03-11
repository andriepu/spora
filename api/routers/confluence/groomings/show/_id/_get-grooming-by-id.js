import axios from '~/api/modules/axios/--confluence';

export default docId => axios.get(`/content/${docId}`, {
  params: { expand: 'ancestors,body.atlas_doc_format' },
}).then(({ data }) => data);
