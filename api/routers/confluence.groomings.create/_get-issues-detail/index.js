const catchify = require('catchify');
const extractFieldsAttachments = require('./_extract-fields-attachments');
const getIssuesV2 = require('./_get-issues-v2');
const getIssuesV3 = require('./_get-issues-v3');
const toConfluenceMedia = require('./_to-confluence-media');
const useConfluenceMedia = require('./_use-confluence-media');

module.exports = async ({ issueKeys, docId }) => {
  if (!issueKeys.length) return [];

  const [
    eIssuesDetail,
    issues,
  ] = await catchify(Promise.all([
    getIssuesV2(issueKeys),
    getIssuesV3(issueKeys),
  ]));

  if (eIssuesDetail) throw eIssuesDetail;

  const [issuesV2, issuesV3] = issues;

  const jiraAttachments = issuesV2.reduce((acc, issue) => ({
    ...acc,
    [issue.key]: extractFieldsAttachments(issue),
  }), {});

  const [
    eAttachments,
    confluenceAttachments,
  ] = await catchify(toConfluenceMedia(docId, jiraAttachments));
  if (eAttachments) throw eAttachments;

  return useConfluenceMedia(issuesV3, confluenceAttachments);
};
