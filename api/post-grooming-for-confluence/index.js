import getIssuesDetail from './_get-issues-detail';
import postGrooming from './_post-grooming';

const { CONFLUENCE_URL } = process.env;

export default async (req, res) => {
  const { title, issues } = req.body;

  const issuesDetail = await getIssuesDetail(issues);

  const data = await postGrooming({
    issues: issuesDetail,
    title,
  });

  res.json({
    id: data.id,
    title: data.title,
    url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  });
};
