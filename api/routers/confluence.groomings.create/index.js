const catchify = require('catchify');
const extractGroomingDoc = require('~/api/utils/adf/extract-grooming-doc');
const addGroomingItems = require('./_add-grooming-items');
const getGroomingTitle = require('./_get-grooming-title');
const getIssuesDetails = require('./_get-issues-detail');
const getPreparedDoc = require('./_get-prepared-doc');

const { CONFLUENCE_URL } = process.env;

exports.post = async (req, res) => {
  const { issues: issueKeys } = req.body;

  const [eTitle, title] = await catchify(getGroomingTitle());
  if (eTitle) return res.error(eTitle);

  const [
    eExistingDoc,
    groomingDoc,
  ] = await catchify(getPreparedDoc(title));
  if (eExistingDoc) return res.error(eExistingDoc);

  const groomingAdf = JSON.parse(groomingDoc.body.atlas_doc_format.value);
  const groomingIssues = extractGroomingDoc(groomingAdf);
  const groomingKeys = groomingIssues.map(({ key }) => key);

  const newIssueKeys = issueKeys.filter(key => !groomingKeys.includes(key));

  const [
    eIssuesDetails,
    issues,
  ] = await catchify(getIssuesDetails({
    issueKeys: newIssueKeys,
    docId: groomingDoc.id,
  }));

  if (eIssuesDetails) return res.error(eIssuesDetails);

  const [
    ePostGrooming,
    resp,
  ] = await catchify(addGroomingItems({ groomingDoc, groomingAdf, issues }));
  if (ePostGrooming) return res.error(ePostGrooming);

  res.json({
    data: {
      id: resp.id,
      title: resp.title,
      url: new URL(`/wiki${resp._links.webui}`, CONFLUENCE_URL).href,
    },
  });
};
