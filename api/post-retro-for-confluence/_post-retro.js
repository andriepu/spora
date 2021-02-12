import { format } from 'date-fns';
import axios from '../_/axios-confluence';
import buildPageInfo, { buildParticipants } from './../_/helpers/confluence/build-page-info';
import normalize from './../_/helpers/confluence/normalize';


const {
  CONFLUENCE_RETRO_PARENT_ID,
  SPACE_KEY,
} = process.env;

const buildRetroTable = ({ contents }) => {
  const maxRow = Object.keys(contents).reduce((acc, column) => (
    Math.max(acc, contents[column].length)
  ), 0);

  return `
    <h2>Retrospective</h2>
    <table data-layout="wide">
      <tbody>
        <tr>
          ${Object.keys(contents).map(title => `<th><p><strong>${title}</strong></p></th>`).join('')}
        </tr>
        ${
          Array.from({ length: maxRow }).map((_, idxRow) => `
            <tr>
              ${
                Object.keys(contents).map((title, idxCol) => `
                  <td>
                    ${
                      contents[title][idxRow]
                        ? `<p>${contents[title][idxRow]}</p>`
                        : ''
                    }
                  </td>
                `).join('')
              }
            </tr>
          `).join('')
        }
      </tbody>
    </table>
  `;
};

const buildActions = ({ actions }) => `
  <h2>Action items</h2>
  <ac:task-list>
    ${
      actions.map((action, idx) => `
        <ac:task>
          <ac:task-id>${idx + 1}</ac:task-id>
          <ac:task-status>incomplete</ac:task-status>
          <ac:task-body><span class="placeholder-inline-tasks">${action.content}${action.pic.length ? ' — ' : ''}${buildParticipants(action.pic)}</span></ac:task-body>
        </ac:task>
      `)
    }
  </ac:task-list>
`;

export default async ({ actions, date, participants, contents }) => {
  const title = `Retrospective @${date}`;
  const type = 'page';
  const representation = 'storage';

  const { data: { id, version } } = await axios.post('/content', {
    title,
    type,
    space: { key: SPACE_KEY },
    ancestors: [{ id: CONFLUENCE_RETRO_PARENT_ID }],
    body: { storage: { value: '', representation } },
  });

  await axios.put(`/content/${id}/convert`);

  const { data } = await axios.put(`/content/${id}`, {
    title,
    type,
    version: {
      number: version.number + 1,
    },
    body: {
      storage: {
        value: normalize(`
          ${buildPageInfo({ date, participants })}
          ${buildRetroTable({ contents })}
          ${buildActions({ actions })}
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

  return data;
};
