const catchify = require('catchify');
const axiosInternal = require('~/api/modules/axios/--internal');
const axiosV2 = require('~/api/modules/axios/--jira--v2');
const customfields = require('~/api/constants/customfields');
const jiraToConfluenceAttachments = require('./jira-to-confluence-attachments');

const { PROJECT_KEY } = process.env;

module.exports = async (keys, docId) => {
  const [
    eIssues,
    issuesDetails,
  ] = await catchify(Promise.all([
    axiosInternal.get('/jira/search', {
      params: { keys: keys.join(',') },
    }).then(({ data }) => data.data),

    axiosV2.get('/search', {
      params: {
        jql: `project="${PROJECT_KEY}" AND key in (${keys}) ORDER BY RANK`,
        fields: Object.keys(customfields).map(k => customfields[k]).join(','),
      },
    }).then(({ data }) => data.issues),
  ]));

  if (eIssues) throw eIssues;

  const [issuesV3, issuesV2] = issuesDetails;

  return jiraToConfluenceAttachments(issuesV2, issuesV3, docId);
};
