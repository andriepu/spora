import axios from '~/api/modules/axios/--jira';
import * as customfields from '~/api/constants/customfields';

const { PROJECT_KEY } = process.env;

export default async (issues) => {
  const keys = issues.join(',');

  const { data } = await axios.get('/search', {
    params: {
      jql: `project="${PROJECT_KEY}" AND key in (${keys}) ORDER BY RANK`,
      fields: Object.keys(customfields).map(k => customfields[k]).join(','),
    },
  });

  return data.issues;
};
