import axiosJira from '~/api/modules/axios/--jira';

export default issueKey => axiosJira.get(`/issue/${issueKey}`, {
  params: { fields: 'attachment' },
}).then(({ data }) => data.fields.attachment);
