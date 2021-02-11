import extractData from './_extract-data';
import postRetro from './_post-to-confluence';

const { CONFLUENCE_URL } = process.env;

export default async (req, res) => {
  const { json: jsonBase64 } = req.body;

  const json = Buffer.from(jsonBase64, 'base64').toString();

  const { date, actions, participants, contents } = extractData(json);
  const data = await postRetro({
    actions,
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
