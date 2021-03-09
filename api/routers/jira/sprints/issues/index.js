import getSprintIssues from './_get-sprint-issues';

export const get = async (req, res) => {
  const { sprintId } = req.query;

  const data = await getSprintIssues(sprintId);
  res.json(data);
};
