import catchify from 'catchify';
import getGroomingIssue from './get-grooming-issue';
import getIssueAttachments from './get-issue-attachments';
import getJiraComponents from './get-jira-components';

export default async (docId, issueKey) => {
  const [
    eGetIssue,
    issue,
  ] = await catchify(getGroomingIssue(docId, issueKey));
  if (eGetIssue) throw eGetIssue;

  const [
    eGetAttachments,
    attachments,
  ] = await catchify(getIssueAttachments(docId, issue));
  if (eGetAttachments) throw eGetAttachments;

  const [
    eComponents,
    components,
  ] = await catchify(getJiraComponents());
  if (eComponents) throw eComponents;

  const filteredComponents = components
    .filter(({ name }) => issue.components.includes(name));

  return {
    issue: {
      ...issue,
      components: filteredComponents,
    },
    attachments,
  };
};
