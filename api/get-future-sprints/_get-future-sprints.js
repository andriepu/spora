import axios from '../_/axios-jira-agile';

const { BOARD_ID } = process.env;

export default () => axios.get(`/board/${BOARD_ID}/sprint`, {
  params: { state: 'future' },
}).then(({ data }) => (
  data.values
    .filter(({ originBoardId }) => `${originBoardId}` === `${BOARD_ID}`)
    .map(({ id, name }) => ({ id, name }))
));
