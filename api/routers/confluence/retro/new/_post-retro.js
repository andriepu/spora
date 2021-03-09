import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import axios from '~/api/modules/axios/--confluence';
import buildPageInfo from '~/api/utils/adf/build-page-info';
import convertMention from '~/api/utils/adf/convert-mention';

const {
  CONFLUENCE_RETRO_PARENT_ID,
  SPACE_KEY,
} = process.env;

const buildNotes = notes => [
  adf.heading({ level: 2 })(adf.text('Notes')),
  adf.ul(
    ...notes.map(note => (
      adf.listItem(convertMention(note.replace(/\n+/g, ' ')))
    )),
  ),
];

const buildActions = actions => [
  adf.heading({ level: 2 })(adf.text('Action Items')),
  adf.taskList({ localId: '' })(
    ...actions.map((action, idx) => (
      adf.taskItem({ localId: `${idx}`, state: 'TODO' })(
        ...convertMention(action.replace(/\n+/g, ' ')),
      )
    )),
  ),
];

const buildRetroTable = (contents) => {
  const maxRow = Object.keys(contents).reduce((acc, column) => (
    Math.max(acc, contents[column].length)
  ), 0);

  const titles = Object.keys(contents);

  return [
    adf.heading({ level: 2 })(adf.text('Retrospective')),
    adf.table(
      adf.tableRow(titles.map(title => (
        adf.tableHeader({ colspan: 1, rowspan: 1 })(
          adf.strong(adf.text(title)),
        )
      ))),

      ...(Array.from({ length: maxRow }).map((_, idxRow) => (
        adf.tableRow(titles.map(title => (
          adf.tableCell({ colspan: 1, rowspan: 1 })(
            adf.text(contents[title][idxRow] || ''),
          )
        )))
      ))),
    ),
  ];
};

export default ({ actions, notes, date, participants, contents }) => (
  axios.post('/content', {
    title: `Retrospective ${date}`,
    type: 'page',
    space: { key: SPACE_KEY },
    ancestors: [{ id: CONFLUENCE_RETRO_PARENT_ID }],
    body: {
      atlas_doc_format: {
        value: JSON.stringify(adf.doc(
          buildPageInfo({ participants, date }),
          ...buildRetroTable(contents),
          ...buildNotes(notes),
          ...buildActions(actions),
        )),
        representation: 'atlas_doc_format',
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
  }).then(({ data }) => data)
);
