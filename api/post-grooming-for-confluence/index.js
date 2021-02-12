import postGrooming from './_post-grooming';

const { CONFLUENCE_URL } = process.env;

export default async (req, res) => {
  const { title, issues } = req.body;

  const data = await postGrooming({
    issues,
    title,
  });

  res.json({
    html: data.groomingTables,
    id: data.id,
    title: data.title,
    url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  });
};
