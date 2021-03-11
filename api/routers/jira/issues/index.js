import catchify from 'catchify';
import getSprintIssues from './_get-sprint-issues';

export const get = async (req, res) => {
  const { sprintId } = req.query;

  const [eIssues, issues] = await catchify(getSprintIssues(sprintId));

  if (eIssues) return res.error(eIssues);

  res.json({ data: issues });
};
