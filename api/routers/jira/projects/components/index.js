import catchify from 'catchify';
import getComponents from './_get-components';

export const get = async (req, res) => {
  const [eComponents, components] = await catchify(
    getComponents(),
  );

  if (eComponents) return res.error(eComponents);

  res.json({ data: components });
};
