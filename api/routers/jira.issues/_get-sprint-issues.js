const axiosJiraAgile = require('~/api/modules/axios/--jira--agile');
const customfields = require('~/api/constants/customfields');

const { BOARD_ID } = process.env;

module.exports = sprintId => (
  axiosJiraAgile.get(`/board/${BOARD_ID}/sprint/${sprintId}/issue`, {
    params: { fields: ['status', ...Object.values(customfields)].join(',') },
  }).then(({ data }) => (
    data.issues
      .filter(({ fields }) => !fields[customfields.PARENT_KEY] && fields.status.statusCategory.key !== 'done')
      .map(({ id, key, fields }) => ({
        id,
        key,
        [customfields.SUMMARY_KEY]: fields[customfields.SUMMARY_KEY],
        [customfields.STORY_POINTS_KEY]: fields[customfields.STORY_POINTS_KEY],
      }))
  ))
);
