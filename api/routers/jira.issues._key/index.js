const catchify = require('catchify');

const cleanupExistingJiraAttachments = require('./_cleanup-jira-attachments');
const convertQnaAsComment = require('./_convert-qna-as-comment');
const getGroomingData = require('./_get-grooming-data');
const patchIssue = require('./_patch-issue');
const uploadToJira = require('./_upload-to-jira-media');

exports.patch = async (req, res) => {
  const { key } = req.params;
  const { groomingId: docId } = req.body;

  const [
    eGroomingData,
    groomingData,
  ] = await catchify(getGroomingData(docId, key));
  if (eGroomingData) return res.error(eGroomingData);

  const { issue, attachments } = groomingData;

  const [
    eCleanupAttachments,
  ] = await catchify(cleanupExistingJiraAttachments(key));
  if (eCleanupAttachments) return res.error(eCleanupAttachments);

  const [
    eUploadAttachments,
    jiraAttachments,
  ] = await catchify(uploadToJira(attachments, key));
  if (eUploadAttachments) return res.error(eUploadAttachments);

  const [eUpdate] = await catchify(patchIssue(issue, { jiraAttachments }));
  if (eUpdate) return res.error(eUpdate);

  const [eComment] = await catchify(convertQnaAsComment(issue));
  if (eComment) return res.error(eComment);

  return res.status(204).send();
};
