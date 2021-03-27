const { pick, flatten } = require('lodash');
const { filter } = require('@atlaskit/adf-utils/traverse');
const axiosConfluence = require('~/api/modules/axios/--confluence');

const {
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
} = require('~/api/constants/customfields');

const { CONFLUENCE_URL } = process.env;

module.exports = (docId, issue) => axiosConfluence.get(
  `/content/${docId}/child/attachment`,
).then(({ data }) => (
  data.results
)).then(attachments => flatten([
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
].map((key) => {
  if (!issue[key]) return [];

  const mediaMap = filter(issue[key], node => node.type === 'media')
    .reduce((acc, media) => ({
      ...acc,
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
