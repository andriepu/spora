import axios from '../_/axios-jira-agile';

import {
  ACCEPTANCE_KEY,
  STORY_POINTS_KEY,
} from '../_/helpers/_customfields';

const { BOARD_ID } = process.env;

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
        description: description
          .replace(/\*(.*?)\*/g, '**$1**')
          .replace(/_(.*?)_/g, '*$1*'),
        notes: notes
          .replace(/\*Constraints & Assumptions\*\n+/, '')
          .replace(/\*(.*?)\*/g, '**$1**')
          .replace(/_(.*?)_/g, '*$1*'),
        summary: fields.summary,
        story_points: fields[STORY_POINTS_KEY],
        acceptances: (fields[ACCEPTANCE_KEY] || '')
          .split(/\n+---+\n+/)
          .filter(Boolean)
          .map(acc => acc.trim()),
      };
    })
));
