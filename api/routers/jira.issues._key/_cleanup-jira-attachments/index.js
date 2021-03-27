const catchify = require('catchify');
const axiosJira = require('~/api/modules/axios/--jira');
const getExistingIssueAttachments = require('./_get-existing-issue-attachments');

module.exports = async (key) => {
  const [
    eJiraAttachments,
    jiraAttachments,
  ] = await catchify(getExistingIssueAttachments(key));
  if (eJiraAttachments) throw eJiraAttachments;

  return Promise.all(jiraAttachments.map(att => (
    axiosJira.delete(`/attachment/${att.id}`)
  )));
};
