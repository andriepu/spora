import { flatten } from 'lodash';
import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import {
  ACCEPTANCE_KEY,
  COMPONENTS_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} from '~/api/constants/customfields';

const { JIRA_URL } = process.env;

const topTitles = [
  'Acceptance Criteria',
  'Implementation Detail',
  'Constraints & Assumptions',
  'Q&A',
];

const dspan = { colspan: 1, rowspan: 1 };

const adfColspan = (colspan, content = '') => adf.tableCell({
  ...dspan,
  colspan,
})(adf.p(content));

export default (issue, { components }) => (
  adf.table(
    adf.tableRow([
      adf.tableHeader({ ...dspan, colspan: 3 })(
        adf.alignment({ align: 'center' })(
          adf.p(adf.inlineCard({
            url: `${JIRA_URL}/browse/${issue.key}`,
          })),
        ),
      ),

      adf.tableHeader({ ...dspan })(
        adf.alignment({ align: 'center' })(
          adf.p(adf.strong(adf.text(
            `${issue.fields[STORY_POINTS_KEY] || '-'}`,
          ))),
        ),
      ),
    ]),

    adf.tableRow([adfColspan(4)]),

    adf.tableRow(topTitles.map(title => (
      adf.tableCell({ ...dspan })(
        adf.alignment({ align: 'center' })(
          adf.p(adf.strong(adf.text(title))),
        ),
      )
    ))),

    adf.tableRow([
      ...[
        ACCEPTANCE_KEY,
        IMPLEMENTATION_KEY,
        CONSTRAINTS_KEY,
      ].map(key => (
        adf.tableCell({ colspan: 1, rowspan: 1 })(
          ...(issue.fields[key]
            ? issue.fields[key].content
            : [adf.p(' ')]
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

    adf.tableRow([adfColspan(4)]),

    adf.tableRow([
      adf.tableCell({
        ...dspan,
        colspan: 3,
        background: '#f4f5f7',
      })(
        adf.alignment({ align: 'center' })(
          adf.p(adf.strong(adf.text(
            'Description',
          ))),
        ),
      ),

      adf.tableCell({
        ...dspan,
        background: '#f4f5f7',
      })(
        adf.p(adf.strong(adf.text(
          'Components',
        ))),
      ),
    ]),

    adf.tableRow([
      adf.tableCell({
        ...dspan,
        colspan: 3,
      })(
        ...(issue.fields[DESCRIPTION_KEY]
          ? issue.fields[DESCRIPTION_KEY].content
          : [adf.p(' ')]
        ),
      ),

      adf.tableCell({ ...dspan })(
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
    ]),
  )
);
