import getSprintIssues from './_get-sprint-issues';

export default async (req, res) => {
  const { sprintId } = req.query;

  const data = await getSprintIssues(sprintId);
  res.json(data);
};
