const { traverse } = require('@atlaskit/adf-utils/traverse');

module.exports = (adf, attachments) => {
  let i = 0;

  return traverse(adf, {
    media (node) {
      const confluenceAttachmentData = attachments[i++];
      node.attrs = confluenceAttachmentData;
      return node;
    },
  });
};
