const { pick } = require('lodash');
const FormData = require('form-data');
const axiosJira = require('~/api/modules/axios/--jira');
const axiosConfluence = require('~/api/modules/axios/--confluence');

module.exports = async (docId, issueKey, attachment) => {
  const { url, filename } = attachment;
  const normalizedName = filename
    .replace(/( - \d+)+$/, '')
    .replace(/^\[\w+-\d+\] /, '');
  const signedName = `[${issueKey}] ${normalizedName}`;

  const { data: file } = await axiosJira.get(url, { responseType: 'stream' });

  const formData = new FormData();
  formData.append('file', file, signedName);

  return axiosConfluence.post(
    `/content/${docId}/child/attachment`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'X-Atlassian-Token': 'nocheck',
      },
    },
  ).then(({ data: { results: [att] } }) => ({
    id: att.extensions.fileId,
    collection: `contentId-${docId}`,
    type: 'file',
    ...pick(attachment, ['width', 'height']),
  }));
};
