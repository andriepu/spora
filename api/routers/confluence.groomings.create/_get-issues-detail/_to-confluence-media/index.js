const uploadAttachment = require('./_upload-attachment');

module.exports = (docId, attachments) => Object.keys(attachments)
  .reduce(async (acc, issueKey) => Promise.resolve({
    ...(await acc),
    [issueKey]: await Object.keys(attachments[issueKey])
      .reduce(async (acc1, fieldKey) => Promise.resolve({
        ...(await acc1),
        [fieldKey]: await Promise.all(
          attachments[issueKey][fieldKey]
            .map(att => uploadAttachment(docId, issueKey, att)),
        ),
      }), Promise.resolve({})),
  }), Promise.resolve({}));
