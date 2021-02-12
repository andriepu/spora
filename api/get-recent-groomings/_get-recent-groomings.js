import axios from '../_/axios-confluence';

const { CONFLUENCE_GROOMING_PARENT_ID } = process.env;

export default () => {
  const limit = 3;

  return axios.get(`/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`)
    .then(({ data }) => (
      data.results
        .slice(-limit)
        .filter(({ title }) => title.startsWith('Grooming @'))
        .map(({ id, title }) => ({ id, title }))
        .reverse()
    ));
};
