import FormData from 'form-data';
import axiosJira from '~/api/modules/axios/--jira';
import axiosConfluence from '~/api/modules/axios/--confluence';

export default async (url, rawFilename, { contentId }) => {
  const filename = `${rawFilename} - ${Date.now()}`;

  const formData = new FormData();

  const resp = await axiosJira.get(url, { responseType: 'stream' });

  formData.append('file', resp.data, filename);

  return axiosConfluence.post(`/content/${contentId}/child/attachment`, formData, {
    headers: {
      ...formData.getHeaders(),
      'X-Atlassian-Token': 'nocheck',
    },
  }).then(({ data: { results: [att] } }) => ({
    id: att.extensions.fileId,
    collection: `contentId-${contentId}`,
    type: 'file',
  }));
};
