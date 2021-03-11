import catchify from 'catchify';
import getJiraComponents from './_get-jira-components';
import patchIssue from './_patch-issue';

export const patch = async (req, res) => {
  const { key } = req.params;
  const { issue } = req.body;

  const [errComponents, components] = await catchify(getJiraComponents());

  if (errComponents) return res.error(errComponents);

  const filteredComponents = components
    .filter(({ id }) => issue.components.includes(id));

  const update = {
    ...issue,
    components: filteredComponents,
  };

  const [errUpdate] = await catchify(patchIssue(key, update));

  if (errUpdate) return res.error(errUpdate);

  return res.status(204).send();
};
