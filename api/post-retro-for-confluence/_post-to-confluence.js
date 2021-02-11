import { format } from 'date-fns';

import axios from '../_/axios-confluence';

const {
  CONFLUENCE_RETRO_PARENT_ID,
  SPACE_KEY,
  SQUAD_NAME,
  MEMBERS,
} = process.env;

const members = MEMBERS.split(',')
  .reduce((acc, m) => {
    const [id, emailName] = m.split('#');
    return { ...acc, [emailName]: id };
  }, {});

const normalize = str => str
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ')
  .replace(/>\s+</g, '><')
  .trim()
  .replace(/&/g, '&amp;');

const createParticipants = (participants, { wrapBy = '' } = {}) => (
  participants.map(emailName => (`
    ${wrapBy}
      ${members[emailName]
        ? `<ac:link><ri:user ri:account-id="${members[emailName]}" /></ac:link>`
        : emailName}
    ${[...wrapBy.split('>').reverse().filter(Boolean), ''].join('>').replace(/(<)/g, '$1/')}
  `)).join('\n')
);

const createInfo = ({ date, participants }) => {
  return `
  <ac:structured-macro ac:name="expand" ac:schema-version="1" data-layout="full-width">
    <ac:parameter ac:name="title">Retrospective Information</ac:parameter>
    <ac:rich-text-body>
      <p><strong>Date</strong> </p>
      <ul>
         <li>
            <p><time datetime="${format(new Date(date), 'yyyy-MM-dd')}" /> </p>
         </li>
      </ul>
      <p><strong>Team </strong></p>
      <ul>
         <li>
            <p>${SQUAD_NAME}</p>
         </li>
      </ul>
      <p><strong>Participants</strong></p>
      <ul>
        ${createParticipants(participants, { wrapBy: '<li><p>' })}
      </ul>
      <p />
    </ac:rich-text-body>
  </ac:structured-macro>
  `;
};

const createTable = ({ contents }) => {
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

const createAction = ({ actions }) => `
  <h2>Action items</h2>
  <ac:task-list>
    ${
      actions.map((action, idx) => `
        <ac:task>
          <ac:task-id>${idx + 1}</ac:task-id>
          <ac:task-status>incomplete</ac:task-status>
          <ac:task-body><span class="placeholder-inline-tasks">${action.content} — ${createParticipants(action.pic)}</span></ac:task-body>
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
          ${createInfo({ date, participants })}
          ${createTable({ contents })}
          ${createAction({ actions })}
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
