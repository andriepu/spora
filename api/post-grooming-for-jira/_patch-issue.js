import axios from './../_/axios-jira-api';

import buildAdfTitle from './../_/helpers/jira/_build-adf-title';

import {
  ACCEPTANCE_KEY,
  STORY_POINTS_KEY,
} from './../_/helpers/_customfields';

export default (key, issue) => axios.put(`/issue/${key}`, {
  fields: {
    [ACCEPTANCE_KEY]: issue.acceptances_adf,
    [STORY_POINTS_KEY]: issue.story_points,
    description: {
      type: 'doc',
      version: 1,
      content: [
        ...issue.description_adf.content,

        { type: 'rule' },

        buildAdfTitle('Constraints & Assumptions'),
        ...issue.notes_adf.content,
      ].filter(Boolean),
    },
  },
});
