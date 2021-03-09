import getIssuesDetail from './_get-issues-detail';
import getActiveSprint from './_get-active-sprint';
import postGrooming from './_post-grooming';

const { CONFLUENCE_URL } = process.env;

export default async (req, res) => {
  const { issues: issueKeys } = req.body;

  const activeSprint = await getActiveSprint();
  // const issuesDetail = await getIssuesDetail(issueKeys);

  // const data = await postGrooming({
  //   issues: issuesDetail,
  //   title,
  // });

  res.json({
    // activeSprint,
    // issuesDetail,
    // id: data.id,
    // title: data.title,
    // url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  });
};
