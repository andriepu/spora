import catchify from 'catchify';
import axios from '../../_/axios-confluence';

const {
  CONFLUENCE_GROOMING_PARENT_ID,
  SPACE_KEY,
} = process.env;

export default async (title) => {
  const [e1, { data }] = await catchify(axios.post('/content', {
    title,
    type: 'page',
    space: { key: SPACE_KEY },
    ancestors: [{ id: CONFLUENCE_GROOMING_PARENT_ID }],
    body: { storage: { value: '', representation: 'storage' } },
  }));

  if (e1) console.errror(e1.message);

  const [e2] = await catchify(axios.put(`/content/${data.id}/convert`));
  if (e2) console.error(e2.message);

  return { id: data.id, version: data.version };
};
