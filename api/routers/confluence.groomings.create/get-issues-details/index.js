const catchify = require('catchify');
const extractGroomingDoc = require('~/api/utils/adf/extract-grooming-doc');
const getAttachments = require('./_get-attachments');

module.exports = async (issueKeys, groomingDoc) => {
  const groomingAdf = JSON.parse(groomingDoc.body.atlas_doc_format.value);
  const groomingIssues = extractGroomingDoc(groomingAdf);
  const groomingKeys = groomingIssues.map(({ key }) => key);

  const newIssueKeys = issueKeys.filter(key => (
    !groomingKeys.includes(key)
  ));

  if (!newIssueKeys.length) return [];

  const [
    eAttachment,
    attachmentsMap,
  ] = await catchify(getAttachments(newIssueKeys, groomingDoc.id));
  if (eAttachment) throw eAttachment;
};
