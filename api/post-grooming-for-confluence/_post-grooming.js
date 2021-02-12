import axios from '../_/axios-confluence';
import buildPageInfo from './../_/helpers/confluence/build-page-info';
import normalize from './../_/helpers/confluence/normalize';
import buildGroomingTable from './_build-grooming-table';

const {
  CONFLUENCE_GROOMING_PARENT_ID,
  SPACE_KEY,
} = process.env;

export default async ({ title: rawTitle, issues }) => {
  const type = 'page';
  const representation = 'storage';

  const pathGetGroomings = `/content/${CONFLUENCE_GROOMING_PARENT_ID}/child/page`;
  const sameTitle = await axios.get(pathGetGroomings, {
    params: {
      expand: 'body.view,history',
      limit: 10,
    },
  }).then(({ data }) => (
    data.results.filter(grooming => new RegExp(rawTitle).test(grooming.title))
  ));

  const title = `${rawTitle} - ${sameTitle.length + 1}`;

  const { data: { id, version } } = await axios.post('/content', {
    title,
    type,
    space: { key: SPACE_KEY },
    ancestors: [{ id: CONFLUENCE_GROOMING_PARENT_ID }],
    body: { storage: { value: '', representation } },
  });

  await axios.put(`/content/${id}/convert`);

  const groomingTables = issues.map(issue => buildGroomingTable(issue)).join('');

  const { data } = await axios.put(`/content/${id}`, {
    title,
    type,
    version: {
      number: version.number + 1,
    },
    body: {
      storage: {
        value: normalize(`
          ${buildPageInfo({ date: new Date() })}
          ${groomingTables}
        `),
        representation,
      },
    },
    metadata: {
      properties: {
        'content-appearance-draft': {
          value: 'full-width',
        },
        'content-appearance-published': {
          value: 'full-width',
        },
      },
    },
  });

  return { groomingTables: normalize(groomingTables), ...data };
};
