import getSprints from './_get-sprints';

export const get = async (req, res) => {
  const { state = 'active,future' } = req.query;
  res.json(await getSprints({ state }));
};
