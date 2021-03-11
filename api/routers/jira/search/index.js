import catchify from 'catchify';
import axios from '~/api/modules/axios/--jira';
import * as customfields from '~/api/constants/customfields';

const { PROJECT_KEY } = process.env;

export const get = async (req, res, next) => {
  const keys = (req.query.keys || '').replace(/\s*/g, '');

  if (!keys) return res.error({ status: 400, message: 'missing required query : keys' });

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
