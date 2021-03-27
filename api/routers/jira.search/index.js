const catchify = require('catchify');
const axios = require('~/api/modules/axios/--jira');
const customfields = require('~/api/constants/customfields');

const { PROJECT_KEY } = process.env;

exports.get = async (req, res, next) => {
  const keys = (req.query.keys || '').replace(/\s*/g, '');

  if (!keys) {
    return res.error({
      message: 'missing required query : keys',
      status: 400,
    });
  }

  const [err, resp] = await catchify(
    axios.get('/search', {
      params: {
        jql: `project="${PROJECT_KEY}" AND key in (${keys}) ORDER BY RANK`,
        fields: Object.keys(customfields).map(k => customfields[k]).join(','),
      },
    }).then(({ data }) => data),
  );

  if (err) return res.error(err);

  return res.json({ data: resp.issues });
};
