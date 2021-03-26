import { filter } from '@atlaskit/adf-utils/traverse';
import uploadToJiraMedia from './_upload-to-jira-media';

export default (adf, confluenceAttachments) => {
  const relatedAttachments = filter(adf, node => node.type === 'media')

  const newJiraAttachments = Promise.all(
    media.map
  );
};

// traverse(adf, {
//   media (node) {
//     const fileId = node.attrs.id;

//     const attachment = attachments
//       .find(({ extensions }) => extensions.fileId === fileId);

//     const { title, _links: { download } } = attachment;

//     return node;
//   },
// });
