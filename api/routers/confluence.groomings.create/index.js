// const catchify = require('catchify');
// const getGroomingTitle = require('./get-grooming-title');
// const getIssuesDetails = require('./get-issues-details');
// const getPreparedDoc = require('./get-prepared-doc');

// const postGrooming = require('./_post-grooming');

// const { CONFLUENCE_URL } = process.env;

exports.post = async (req, res) => {
  console.log('groomings create');
  // const { issues: issueKeys } = req.body;

  // const [eTitle, title] = await catchify(getGroomingTitle());
  // if (eTitle) return res.error(eTitle);

  // const [
  //   eExistingDoc,
  //   existingDoc,
  // ] = await catchify(getPreparedDoc(title));
  // if (eExistingDoc) return res.error(eExistingDoc);

  // return;

  // const [
  //   eIssuesDetails,
  //   issuesWithDetails,
  // ] = await catchify(getIssuesDetails(issueKeys, existingDoc));
  // if (eIssuesDetails) return res.error(eIssuesDetails);

  // const [ePostGrooming, data] = await catchify(postGrooming({ issueKeys }));
  // if (ePostGrooming) return res.error(ePostGrooming);

  // res.json({
  //   data: {
  //     id: data.id,
  //     title: data.title,
  //     url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  //   },
  // });
};
