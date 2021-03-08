import extractData from './_extract-data';
import postRetro from './_post-retro';

const { CONFLUENCE_URL } = process.env;

export default async (req, res) => {
  const { json: jsonBase64 } = req.body;

  const json = Buffer.from(jsonBase64, 'base64').toString();

  const { date, notes, actions, participants, contents } = extractData(json);

  const data = await postRetro({
    actions,
    notes,
    date,
    contents,
    participants,
  });

  res.json({
    id: data.id,
    title: data.title,
    url: new URL(`/wiki${data._links.webui}`, CONFLUENCE_URL).href,
  });
};
