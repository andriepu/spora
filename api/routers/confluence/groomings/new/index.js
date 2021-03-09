import getIssuesDetail from './_get-issues-detail';
import postGrooming from './_post-grooming';

const { CONFLUENCE_URL } = process.env;

export const post = async (req, res) => {
  const { issues: issueKeys } = req.body;

  const issuesDetail = await getIssuesDetail(issueKeys);

  const data = await postGrooming({
    issues: issuesDetail,
  });

  res.json({
    issuesDetail,
    // id: data.id,
    // title: data.title,
    // url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  });
};
