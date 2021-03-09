import { flatten } from 'lodash';
import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import axios from '~/api/modules/axios/--confluence';
import buildPageInfo from '~/api/utils/adf/build-page-info';
import {
  ACCEPTANCE_KEY,
  COMPONENTS_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} from '~/api/constants/customfields';

import getActiveSprint from './_get-active-sprint';
import getJiraComponents from './_get-jira-components';

const {
  CONFLUENCE_GROOMING_PARENT_ID,
  JIRA_URL,
  SPACE_KEY,
} = process.env;

const topTitles = [
  'Components',
  'Acceptance Criteria',
  'Implementation Detail',
  'Constraints & Assumptions',
  'Q&A',
];

const buildSingleTable = (issue, { components }) => (
  adf.table(
    adf.tableRow(topTitles.map(title => (
      adf.tableHeader({ colspan: 1, rowspan: 1 })(
        adf.alignment({ align: 'center' })(adf.p(adf.strong(adf.text(title)))),
      )
    ))),

    adf.tableRow([
      adf.tableCell({ colspan: 1, rowspan: 1 })(
        adf.taskList()(
          ...(components.map(component => (
            adf.taskItem({
              localId: `${component.id}`,
              state: issue.fields[COMPONENTS_KEY].some(({ id }) => id === component.id)
                ? 'DONE'
                : 'TODO',
            })(
              adf.text(component.name),
            )
          ))),
        ),
      ),

      ...[
        ACCEPTANCE_KEY,
        IMPLEMENTATION_KEY,
        CONSTRAINTS_KEY,
      ].map(key => (
        adf.tableCell({ colspan: 1, rowspan: 1 })(
          ...(issue.fields[key]
            ? issue.fields[key].content
            : [adf.alignment({ align: 'center' })(adf.p('-'))]
          ),
        )),
      ),

      adf.tableCell({ colspan: 1, rowspan: 1 })(
        ...flatten(['Questions', 'Actions'].map(key => [
          adf.p(adf.underline(adf.subsup({ type: 'sub' })(
            adf.text(key),
          ))),

          adf.taskList()(
            adf.taskItem({ state: 'TODO' })(
              adf.text('-'),
            ),
          ),
        ])),
      ),
    ]),

    adf.tableRow([
      adf.tableHeader({ colspan: 1, rowspan: 1 })(
        adf.p(adf.strong(adf.text('Jira Ticket'))),
      ),

      adf.tableCell({ colspan: 4, rowspan: 1 })(
        adf.p(
          adf.inlineCard({
            url: new URL(`/browse/${issue.key}`, JIRA_URL).href,
          }),
        ),
      ),
    ]),

    adf.tableRow([
      adf.tableHeader({ colspan: 1, rowspan: 1 })(
        adf.p(adf.strong(adf.text('Description'))),
      ),

      adf.tableCell({ colspan: 4, rowspan: 1 })(
        ...(issue.fields[DESCRIPTION_KEY]
          ? issue.fields[DESCRIPTION_KEY].content
          : [adf.p('-')]
        ),
      ),
    ]),

    adf.tableRow([
      adf.tableHeader({ colspan: 1, rowspan: 1 })(
        adf.p(adf.strong(adf.text('Story Points'))),
      ),

      adf.tableCell({ colspan: 4, rowspan: 1 })(
        adf.p(`${issue.fields[STORY_POINTS_KEY] || '-'}`),
      ),
    ]),
  )
);

export default async ({ issues }) => {
  const activeSprint = await getActiveSprint();
  const components = await getJiraComponents();

  return axios.post('/content', {
    title: `Grooming ${activeSprint.name}`,
    type: 'page',
    space: { key: SPACE_KEY },
    ancestors: [{ id: CONFLUENCE_GROOMING_PARENT_ID }],
    body: {
      atlas_doc_format: {
        value: JSON.stringify(adf.doc(
          buildPageInfo({ date: new Date() }),
          ...issues.map(issue => buildSingleTable(issue, { components })),
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
  }).then(({ data }) => data);
};
