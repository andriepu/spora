import { JSDOM } from 'jsdom';
import axios from '../_/axios-confluence';

export default async (contentId) => {
  const groomingDoc = await axios.get(`/content/${contentId}`, {
    params: { expand: 'body.view,body.atlas_doc_format' },
  }).then(({ data }) => data);

  const { document } = new JSDOM(
    groomingDoc.body.view.value.replace(/(<\/)/g, ' $1'),
  ).window;

  const adf = JSON.parse(groomingDoc.body.atlas_doc_format.value);

  const tables = document.querySelectorAll('table');

  return Array.from(tables).map(table => ({
    key: table.querySelector('tr:nth-child(2) > td:nth-child(1)')
      .textContent
      .trim()
      .split('/')
      .pop(),
    acceptances_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[1].content[1].content[1].content,
    },
    description_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[1].content[1].content[2].content,
    },
    notes_adf: {
      type: 'doc',
      version: 1,
      content: adf.content[1].content[1].content[3].content,
    },
    story_points: Number(table.querySelector('tr:nth-child(4) > td:nth-child(2)')
      .textContent
      .trim()),
  }));
};
