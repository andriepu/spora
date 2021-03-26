import catchify from 'catchify';
// import addComment from './_add-comment';
// import getCompleteIssueData from './_get-complete-issue-data';
// import filterComments from './_filter-comments';
// import getExistingComments from './_get-existing-comments';

import cleanupExistingJiraAttachments from './cleanup-jira-attachments';
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

  // const update = await getCompleteIssueData({
  //   issue: groomingIssue,
  //   docId,
  // });


  // if (eUpdate) return res.error(eUpdate);

  // if (groomingIssue.comment) {
  //   const [eExistingComments, existingComments] = await catchify(
  //     getExistingComments(key),
  //   );

  //   if (eExistingComments) return res.error(eExistingComments);

  //   const filteredComments = filterComments(
  //     groomingIssue.comment,
  //     existingComments,
  //   );

  //   const [eAddComment] = await catchify(addComment(key, filteredComments));

  //   if (eAddComment) return res.error(eAddComment);
  // }

  return res.status(204).send();
};
