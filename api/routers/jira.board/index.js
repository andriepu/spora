const catchify = require('catchify');
const getSprints = require('./_get-sprints');

exports.get = async (req, res) => {
  const { state = 'active,future' } = req.query;
  const [eSprints, sprints] = await catchify(getSprints({ state }));

  if (eSprints) return res.error(eSprints);

  res.json({ data: sprints });
};
