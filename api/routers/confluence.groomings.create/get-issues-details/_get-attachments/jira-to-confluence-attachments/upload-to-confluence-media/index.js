const FormData = require('form-data');
const axiosJira = require('~/api/modules/axios/--jira');
const axiosConfluence = require('~/api/modules/axios/--confluence');

module.exports = async (url, rawFilename, { docId }) => {
  const formData = new FormData();

  const { data: file } = await axiosJira.get(url, { responseType: 'stream' });

  const filename = `${rawFilename} - ${Date.now()}`;
  formData.append('file', file, filename);

  return axiosConfluence.post(`/content/${docId}/child/attachment`, formData, {
    headers: {
      ...formData.getHeaders(),
      'X-Atlassian-Token': 'nocheck',
    },
  }).then(({ data: { results: [att] } }) => ({
    id: att.extensions.fileId,
    collection: `contentId-${docId}`,
    type: 'file',
  }));
};
