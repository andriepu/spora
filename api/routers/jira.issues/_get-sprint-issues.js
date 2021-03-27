const axios = require('~/api/modules/axios/--jira--agile');
const customfields = require('~/api/constants/customfields');

const { BOARD_ID } = process.env;

module.exports = sprintId => axios.get(`/board/${BOARD_ID}/sprint/${sprintId}/issue`, {
  params: { fields: Object.values(customfields).join(',') },
}).then(({ data }) => (
  data.issues
    .filter(({ fields }) => !fields[customfields.PARENT_KEY])
    .map(({ id, key, fields }) => ({
      id,
      key,
      [customfields.SUMMARY_KEY]: fields[customfields.SUMMARY_KEY],
      [customfields.STORY_POINTS_KEY]: fields[customfields.STORY_POINTS_KEY],
    }))
));
