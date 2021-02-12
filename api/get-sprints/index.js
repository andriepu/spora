import getSprints from './_get-sprints';

export default async (req, res) => {
  const { state = 'active,future' } = req.query;
  const data = await getSprints({ state });
  res.json(data);
};
