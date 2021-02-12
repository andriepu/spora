import { markdown } from 'markdown';
import wrapHTML from './../_/helpers/confluence/wrap-html';

const { JIRA_URL } = process.env;

export default (issue) => {
  const issueUrl = new URL(`/browse/${issue.key}`, JIRA_URL).href;
  const acceptances = issue.acceptances.map(acceptance => acceptance
    .split('\n')
    .map(point => wrapHTML(point, '<p>'))
    .join(''),
  ).join('<hr />');

  return `
    <table data-layout="default">
      <colgroup>
        <col style="width: 191.0px;" />
        <col style="width: 162.0px;" />
        <col style="width: 217.0px;" />
        <col style="width: 190.0px;" />
      </colgroup>
      <tbody>
        <tr>
          <th>
            <p><strong>Jira Ticket</strong></p>
          </th>
          <th>
            <p><strong>Acceptance Criteria</strong></p>
          </th>
          <th>
            <p><strong>Implementation Detail</strong></p>
          </th>
          <th>
            <p><strong>Notes & Constraints</strong></p>
          </th>
        </tr>
        <tr>
          <td rowspan="2">
            <p><a href="${issueUrl}" data-card-appearance="inline">${issueUrl}</a> </p>
          </td>
          <td>
            ${acceptances}
          </td>
          <td>
            ${markdown.toHTML(issue.description || '-')}
          </td>
          <td>
            ${markdown.toHTML(issue.notes || '-')}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <p />
          </td>
        </tr>
        <tr>
          <td>
            <p><strong>Story Points</strong></p>
          </td>
          <td colspan="3">
            <p>${issue.story_points || '-'}</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;
};
