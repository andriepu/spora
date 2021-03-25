import catchify from 'catchify';
import postGrooming from './_post-grooming';

const { CONFLUENCE_URL } = process.env;

export const post = async (req, res) => {
  const { issues: issueKeys } = req.body;

  const [ePostGrooming, data] = await catchify(postGrooming({ issueKeys }));

  if (ePostGrooming) return res.error(ePostGrooming);

  res.json({
    data: {
      id: data.id,
      title: data.title,
      url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
    },
  });
};
