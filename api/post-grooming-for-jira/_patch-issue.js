import axios from '~/api/modules/axios/--jira';
import {
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} from '~/api/constants/customfields';

export default (key, issue) => axios.put(`/issue/${key}`, {
  fields: {
    [ACCEPTANCE_KEY]: issue.acceptances_adf,
    [CONSTRAINTS_KEY]: issue.constraints_adf,
    [DESCRIPTION_KEY]: issue.description_adf,
    [IMPLEMENTATION_KEY]: issue.implementation_adf,
    [STORY_POINTS_KEY]: Number(issue.story_points || 0),
  },
});
