import axios from '../../_/axios-confluence';

const { CONFLUENCE_GROOMING_PARENT_ID } = process.env;

export default () => axios.get(`/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`, {
  params: { expand: 'body.atlas_doc_format' },
})
  .then(({ data }) => (
    data.results
      .filter(({ title }) => title.startsWith('Grooming @'))
      .pop()
  ));
