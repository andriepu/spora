const customfields = require('~/api/constants/customfields');

module.exports = (issueV2) => {
  const attachmentsByName = issueV2.fields.attachment
    .reduce((acc, att) => ({
      ...acc,
      [att.filename]: {
        filename: att.filename,
        url: att.content,
      },
    }), {});

  return customfields.$fieldsWithEditor
    .reduce((acc, fieldKey) => ({
      ...acc,
      [fieldKey]: ((issueV2.fields[fieldKey] || '')
        .match(/!(.*)?\|width=\d+,height=\d+!/g) || [])
        .map(att => ({
          ...attachmentsByName[att.replace(/!(.*)?\|.*/, '$1')],
          height: Number(att.replace(/.*\|.*?height=(\d+).*/, '$1')),
          width: Number(att.replace(/.*\|.*?width=(\d+).*/, '$1')),
        })),
    }), {});
};
