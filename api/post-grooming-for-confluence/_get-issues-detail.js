import axios from '../_/axios-jira-api';

import * as customfields from '../_/helpers/_customfields';

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
