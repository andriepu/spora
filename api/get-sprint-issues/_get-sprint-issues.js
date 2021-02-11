import axios from '../_/axios-jira-agile';

const { BOARD_ID } = process.env;

const STORY_POINTS_KEY = 'customfield_10022';
const ACCEPTANCE_KEY = 'customfield_10102';

const fields = [
  'description',
  'parent',
  'summary',
  STORY_POINTS_KEY,
  ACCEPTANCE_KEY,
].join(',');

export default sprintId => axios.get(`/board/${BOARD_ID}/sprint/${sprintId}/issue`, {
  params: { fields },
}).then(({ data }) => (
  data.issues
    .filter(({ fields }) => !fields.parent)
    .map(({ id, key, fields }) => {
      const [description = '', notes = ''] = (fields.description || '')
        .split(/\n+---+\n+/);

      return {
        id,
        key,
        description,
        notes: notes.replace(/\*Notes & Constraints\*\n+/, ''),
        summary: fields.summary,
        story_points: fields[STORY_POINTS_KEY],
        acceptances: (fields[ACCEPTANCE_KEY] || '')
          .split(/\n+---+\n+/)
          .filter(Boolean)
          .map(acc => acc.trim()),
      };
    })
));
