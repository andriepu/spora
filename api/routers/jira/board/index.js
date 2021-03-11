import catchify from 'catchify';
import getSprints from './_get-sprints';

export const get = async (req, res) => {
  const { state = 'active,future' } = req.query;
  const [eSprints, sprints] = await catchify(getSprints({ state }));

  if (eSprints) return res.error(eSprints);

  res.json({ data: sprints });
};
