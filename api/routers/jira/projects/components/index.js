import getComponents from './_get-components';

export const get = async (req, res) => {
  const data = await getComponents();
  res.json(data);
};
