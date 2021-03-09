import axios from '~/api/modules/axios/--confluence';

import buildPageInfo from '~/api/utils/adf/build-page-info';
// import normalizeHtml from '../../_/helpers/_normalize-html';

const template = `
  <table data-layout="default">
    <colgroup>
      <col style="width: 103.0px;" />
      <col style="width: 171.0px;" />
      <col style="width: 201.0px;" />
      <col style="width: 152.0px;" />
      <col style="width: 133.0px;" />
    </colgroup>
    <tbody>
      <tr>
        <th>
          <p><strong>Jira Ticket</strong></p>
        </th>
        <th>
          <p style="text-align: center;"><strong>Acceptance Criteria</strong></p>
        </th>
        <th>
          <p style="text-align: center;"><strong>Implementation Detail</strong></p>
        </th>
        <th colspan="2">
          <p style="text-align: center;"><strong>Constraints & Assumptions</strong></p>
        </th>
      </tr>
      <tr>
        <td><p /></td>
        <td><p /></td>
        <td><p /></td>
        <td><p /></td>
        <td>
          <p><strong>Questions</strong></p>
          <ac:task-list>
             <ac:task>
                <ac:task-id>1</ac:task-id>
                <ac:task-status>incomplete</ac:task-status>
             </ac:task>
          </ac:task-list>
          <hr />
          <p><strong>Actions</strong></p>
          <ac:task-list>
             <ac:task>
                <ac:task-id>2</ac:task-id>
                <ac:task-status>incomplete</ac:task-status>
             </ac:task>
          </ac:task-list>
        </td>
      </tr>
      <tr>
        <td><p><strong>Description</strong></p></td>
        <td colspan="4"><p /></td>
      </tr>
      <tr>
        <td><p><strong>Story Points</strong></p></td>
        <td colspan="4"><p /></td>
      </tr>
    </tbody>
  </table>
`;

export default ({ id, issues, title, version }) => axios.put(`/content/${id}`, {
  title,
  type: 'page',
  version: {
    number: version,
  },
  body: {
    storage: {
      // value: normalizeHtml(`
      //   ${buildPageInfo({ date: new Date() })}
      //   ${issues.map(issue => template).join('')}
      // `),
      representation: 'storage',
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
