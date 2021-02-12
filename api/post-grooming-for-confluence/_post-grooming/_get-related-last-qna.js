import catchify from 'catchify';
import axios from '../../_/axios-confluence';

const { CONFLUENCE_GROOMING_PARENT_ID } = process.env;

const path = `/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`;

export default async (issues) => {
  const keys = issues.map(({ key }) => key);

  const [e1, lastGrooming] = await catchify(axios.get(path, {
    params: { expand: 'body.atlas_doc_format' },
  }).then(({ data }) => (
    data.results
      .filter(({ title }) => title.startsWith('Grooming @'))
      .pop()
  )));

  if (e1) console.error(e1.response.data);

  if (!lastGrooming) return {};

  const adf = JSON.parse(lastGrooming.body.atlas_doc_format.value);

  return adf.content
    .filter(({ type }) => type === 'table')
    .reduce((acc, table, i) => {
      const key = (JSON.stringify(adf.content[i + 1].content[1].content[0])
        .match(/"url":\s*"(.*)"/) || [''])
        .pop()
        .split('/')
        .pop();

      return {
        ...acc,
        ...(keys.includes(key) && {
          [key]: {
            type: 'doc',
            version: 1,
            content: adf.content[i + 1].content[1].content[4].content,
          },
        }),
      };
    }, {});
};
