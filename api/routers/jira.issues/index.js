const catchify = require('catchify');
const getSprintIssues = require('./_get-sprint-issues');

exports.get = async (req, res) => {
  const { sprintId } = req.query;

  const [eIssues, issues] = await catchify(getSprintIssues(sprintId));

  if (eIssues) return res.error(eIssues);

  res.json({ data: issues });
};
