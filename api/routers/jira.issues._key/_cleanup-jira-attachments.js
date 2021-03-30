const catchify = require('catchify');
const axiosJira = require('~/api/modules/axios/--jira');

const getExistingAttachments = issueKey => axiosJira.get(`/issue/${issueKey}`, {
  params: { fields: 'attachment' },
}).then(({ data }) => data.fields.attachment);

module.exports = async (key) => {
  const [
    eJiraAttachments,
    jiraAttachments,
  ] = await catchify(getExistingAttachments(key));
  if (eJiraAttachments) throw eJiraAttachments;

  return Promise.all(jiraAttachments.map(att => (
    axiosJira.delete(`/attachment/${att.id}`)
  )));
};
