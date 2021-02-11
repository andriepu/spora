import getFutureSprints from './_get-future-sprints';

export default async (req, res) => {
  const data = await getFutureSprints();
  res.json(data);
};
