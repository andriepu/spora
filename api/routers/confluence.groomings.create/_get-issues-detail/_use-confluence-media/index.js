const customfields = require('~/api/constants/customfields');
const useConfluenceMedia = require('./_use-confluence-media');

module.exports = (issuesV3, attachments) => issuesV3.map(issue => ({
  ...issue,
  fields: {
    ...issue.fields,
    ...customfields.$fieldsWithEditor
      .reduce((acc, fieldKey) => ({
        ...acc,
        [fieldKey]: issue.fields[fieldKey]
          ? useConfluenceMedia(
            issue.fields[fieldKey],
            attachments[issue.key][fieldKey],
          ) : null,
      }), {}),
  },
}));
