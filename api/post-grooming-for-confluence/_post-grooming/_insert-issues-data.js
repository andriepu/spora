import { set } from 'lodash';
import catchify from 'catchify';

import axios from '../../_/axios-confluence';

import {
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} from '../../_/helpers/_customfields';

const { JIRA_URL } = process.env;

export default async ({ id, issues, lastQnA, title, version }) => {
  const [e1, adf] = await catchify(axios.get(`/content/${id}`, {
    params: {
      expand: 'body.atlas_doc_format',
    },
  }).then(({ data }) => JSON.parse(data.body.atlas_doc_format.value)));
  if (e1) console.error(e1.response.data);

  return new Promise((resolve) => {
    setTimeout(async () => {
      const [e2, resp] = await catchify(axios.put(`/content/${id}`, {
        title,
        type: 'page',
        version: { number: version },
        body: {
          atlas_doc_format: {
            value: JSON.stringify({
              version: 1,
              type: 'doc',
              content: (() => {
                const tables = adf.content
                  .filter(({ type }) => type === 'table');

                if (!tables.length) return adf.content;

                issues.forEach((issue, i) => {
                  const table = tables[i];

                  [
                    ['1.4', lastQnA[issue.key]],
                    ['1.3', issue.fields[CONSTRAINTS_KEY]],
                    ['1.2', issue.fields[IMPLEMENTATION_KEY]],
                    ['1.1', issue.fields[ACCEPTANCE_KEY]],
                    ['1.0', { content: [{ type: 'inlineCard', attrs: { url: new URL(`/browse/${issue.key}`, JIRA_URL).href } }] }],
                    ['2.1', issue.fields[DESCRIPTION_KEY]],
                    ['3.1', { content: [{ type: 'text', text: `${issue.fields[STORY_POINTS_KEY] || ''}` }] }],
                  ].filter(Boolean).forEach(([pos, data]) => {
                    if (!data) return;
                    set(table, `${pos.replace(/(\d+)/g, 'content[$1]')}.content`, data.content);
                  });
                });

                return adf.content;
              })(),
            }),
            representation: 'atlas_doc_format',
          },
        },
      }));

      if (e2) console.error(e2.response.data);

      resolve(resp.data);
    }, 1000);
  });
};
