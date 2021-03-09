import catchify from 'catchify';
import axios from '~/api/modules/axios/--confluence';

export default async (contentId) => {
  const [e1, groomingDoc] = await catchify(axios.get(`/content/${contentId}`, {
    params: { expand: 'body.view,body.atlas_doc_format' },
  }).then(({ data }) => data));
  if (e1) console.error(e1.response.data);

  const adf = JSON.parse(groomingDoc.body.atlas_doc_format.value);

  const tables = adf.content
    .filter(({ type }) => type === 'table');

  return tables.map((_, i) => ({
    key: (JSON.stringify(adf.content[i + 1].content[1].content[0])
      .match(/"url":\s*"(.*)"/) || [''])
      .pop()
      .split('/')
      .pop(),

    acceptances_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[i + 1].content[1].content[1].content,
    },

    implementation_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[i + 1].content[1].content[2].content,
    },

    constraints_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[i + 1].content[1].content[3].content,
    },

    description_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[i + 1].content[2].content[1].content,
    },

    story_points: (JSON.stringify(adf.content[i + 1].content[3].content[1])
      .match(/"text":\s*"(\d+)"/) || [0])
      .pop(),
  }));
};
