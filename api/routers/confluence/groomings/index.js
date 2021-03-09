import getRecentGroomings from './_get-recent-groomings';

export const get = async (req, res) => {
  const data = await getRecentGroomings();
  res.json(data);
};
