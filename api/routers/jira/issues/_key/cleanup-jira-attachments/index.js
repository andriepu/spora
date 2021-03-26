import catchify from 'catchify';
import getExistingIssueAttachments from './get-existing-issue-attachments';
import axiosJira from '~/api/modules/axios/--jira';

export default async (key) => {
  const [
    eJiraAttachments,
    jiraAttachments,
  ] = await catchify(getExistingIssueAttachments(key));
  if (eJiraAttachments) throw eJiraAttachments;

  return Promise.all(jiraAttachments.map(att => (
    axiosJira.delete(`/attachment/${att.id}`)
  )));
};
