const catchify = require('catchify');
const getComponents = require('./_get-components');

exports.get = async (req, res) => {
  const [
    eComponents,
    components,
  ] = await catchify(getComponents());
  if (eComponents) return res.error(eComponents);

  res.json({ data: components });
};
