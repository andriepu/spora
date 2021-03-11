import axios from '~/api/modules/axios/--jira-agile';
import * as customfields from '~/api/constants/customfields';

const { BOARD_ID } = process.env;

export default sprintId => axios.get(`/board/${BOARD_ID}/sprint/${sprintId}/issue`, {
  params: { fields: Object.values(customfields).join(',') },
}).then(({ data }) => (
  data.issues
    .filter(({ fields }) => !fields[customfields.PARENT_KEY])
    .map(({ id, key, fields }) => ({
      id,
      key,
      summary: fields[customfields.SUMMARY_KEY],
      story_points: fields[customfields.STORY_POINTS_KEY],
    }))
));
