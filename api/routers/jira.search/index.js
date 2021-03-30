const catchify = require('catchify');
const getIssuesDetail = require('./_get-issues-detail');

exports.get = async (req, res, next) => {
  const keys = (req.query.keys || '').replace(/\s*/g, '');

  if (!keys) {
    return res.error({
      message: 'missing required query : keys',
      status: 400,
    });
  }

  const [eSearchIssues, resp] = await catchify(getIssuesDetail(keys));

  if (eSearchIssues) return res.error(eSearchIssues);

  return res.json({ data: resp.issues });
};
