import axios from '~/api/modules/axios/--jira';
import {
  ACCEPTANCE_KEY,
  COMPONENTS_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} from '~/api/constants/customfields';

export default (key, update) => axios.put(`/issue/${key}`, {
  fields: {
    [ACCEPTANCE_KEY]: update.acceptances_adf,
    [COMPONENTS_KEY]: update.components,
    [CONSTRAINTS_KEY]: update.constratints_adf,
    [DESCRIPTION_KEY]: update.description_adf,
    [IMPLEMENTATION_KEY]: update.implementation_adf,
    [STORY_POINTS_KEY]: update.story_points,
  },
});
