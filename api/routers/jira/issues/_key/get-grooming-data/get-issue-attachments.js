import { pick, flatten } from 'lodash';
import { filter } from '@atlaskit/adf-utils/traverse';
import axiosConfluence from '~/api/modules/axios/--confluence';

import {
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
} from '~/api/constants/customfields';

const { CONFLUENCE_URL } = process.env;

export default (docId, issue) => axiosConfluence.get(
  `/content/${docId}/child/attachment`,
).then(({ data }) => (
  data.results
)).then(attachments => flatten([
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
].map((key) => {
  const mediaMap = filter(issue[key], node => node.type === 'media')
    .reduce((acc, media) => ({
      [media.attrs.id]: media,
    }), {});

  return attachments
    .filter(attachment => mediaMap[attachment.extensions.fileId])
    .map(attachment => ({
      id: attachment.extensions.fileId,
      filename: attachment.title.replace(/( - \d+)+$/, ''),
      url: `${CONFLUENCE_URL}/wiki/${attachment._links.download}`,
      ...pick(mediaMap[attachment.extensions.fileId].attrs, ['width', 'height']),
    }));
})));
