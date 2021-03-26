import { pick } from 'lodash';
import FormData from 'form-data';
import axiosJira from '~/api/modules/axios/--jira';

export default (attachments, key) => Promise.all(attachments.map(att => (
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
