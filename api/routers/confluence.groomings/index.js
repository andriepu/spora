const getRecentGroomings = require('./_get-recent-groomings');

exports.get = async (req, res) => {
  const data = await getRecentGroomings();
  res.json({ data });
};
