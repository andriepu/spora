const catchify = require('catchify');
const getGroomingIssue = require('./_get-grooming-issue');
const getIssueAttachments = require('./_get-issue-attachments');
const getJiraComponents = require('./_get-jira-components');

module.exports = async (docId, issueKey) => {
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
