const { pick } = require('lodash');
const FormData = require('form-data');
const axiosJira = require('~/api/modules/axios/--jira');

module.exports = (attachments, key) => Promise.all(attachments.map(att => (
  axiosJira.get(att.url, { responseType: 'stream' })
    .then(({ data: file }) => {
      const filename = `${att.filename} - ${Date.now()}`;

      const formData = new FormData();
      formData.append('file', file, filename);

      return axiosJira.post(`/issue/${key}/attachments`, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Atlassian-Token': 'nocheck',
        },
      }).then(({ data }) => ({
        ...data[0],
        confluence_reference: pick(att, ['id', 'width', 'height']),
      }));
    })
)));
