import getRecentGroomings from './_get-recent-groomings';

export default async (req, res) => {
  const data = await getRecentGroomings();
  res.json(data);
};
