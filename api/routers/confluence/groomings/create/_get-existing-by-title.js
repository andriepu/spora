import axios from '~/api/modules/axios/--confluence';

const { CONFLUENCE_GROOMING_PARENT_ID } = process.env;

export default title => axios.get(`/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`, {
  params: { expand: 'body.atlas_doc_format,version' },
})
  .then(({ data }) => (
    data.results.find(grooming => title === grooming.title)
  ));
