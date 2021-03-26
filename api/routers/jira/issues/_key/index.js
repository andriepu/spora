import catchify from 'catchify';

import cleanupExistingJiraAttachments from './cleanup-jira-attachments';
import convertQnaAsComment from './convert-qna-as-comment';
import getGroomingData from './get-grooming-data';
import patchIssue from './patch-issue';
import uploadToJira from './upload-to-jira-media';

export const patch = async (req, res) => {
  const { key } = req.params;
  const { groomingId: docId } = req.body;

  const [
    eGroomingData,
    { issue, attachments },
  ] = await catchify(getGroomingData(docId, key));
  if (eGroomingData) return res.error(eGroomingData);

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
