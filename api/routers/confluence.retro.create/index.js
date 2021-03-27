const catchify = require('catchify');
const extractMetroretroData = require('./_extract-metroretro-data');
const postRetro = require('./_post-retro');

const { CONFLUENCE_URL } = process.env;

exports.post = async (req, res) => {
  const { json: jsonBase64 } = req.body;

  const json = Buffer.from(jsonBase64, 'base64').toString();

  const {
    date,
    notes,
    actions,
    participants,
    contents,
  } = extractMetroretroData(json);

  const [errContent, content] = await catchify(postRetro({
    actions,
    notes,
    date,
    contents,
    participants,
  }));

  if (errContent) res.error(errContent);

  res.json({
    data: {
      id: content.id,
      title: content.title,
      url: new URL(`/wiki${content._links.webui}`, CONFLUENCE_URL).href,
    },
  });
};
