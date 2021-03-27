const customfields = require('~/api/constants/customfields');
const convertToConfluenceMedia = require('./convert-to-confluence-media');
const uploadToConfluenceMedia = require('./upload-to-confluence-media');

const fieldsWithEditor = [
  customfields.ACCEPTANCE_KEY,
  customfields.CONSTRAINTS_KEY,
  customfields.DESCRIPTION_KEY,
  customfields.IMPLEMENTATION_KEY,
];

module.exports = (issuesV2, issuesV3, docId) => issuesV2.reduce(async (promise, issue) => {
  const confluenceAttachments = await issue.fields.attachment
    .reduce(async (promise1, att) => Promise.resolve({
      ...(await promise1),
      [att.filename]: await uploadToConfluenceMedia(
        att.content,
        att.filename,
        { docId },
      ),
    }), Promise.resolve({}));

  return Promise.resolve({
    ...(await promise),
    [issue.key]: fieldsWithEditor.reduce((acc1, key) => ({
      ...acc1,
      [key]: ((issue.fields[key] || '')
        .match(/!(.*)?\|width=\d+,height=\d+!/g) || [])
        .map(att => ({
          ...confluenceAttachments[att.replace(/!(.*)?\|.*/, '$1')],
          height: Number(att.replace(/.*\|.*?height=(\d+).*/, '$1')),
          width: Number(att.replace(/.*\|.*?width=(\d+).*/, '$1')),
        })),
    }), {}),
  });
}, Promise.resolve({})).then(attachments => issuesV3.map(issue => ({
  ...issue,
  fields: {
    ...issue.fields,
    ...(fieldsWithEditor.reduce((acc, fieldKey) => ({
      ...acc,
      [fieldKey]: issue.fields[fieldKey]
        ? convertToConfluenceMedia(issue.fields[fieldKey], {
          attachments: attachments[issue.key][fieldKey],
        })
        : null,
    }), {})),
  },
})));
