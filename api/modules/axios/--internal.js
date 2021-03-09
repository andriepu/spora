import axios from 'axios';

const { PORT, SECRET } = process.env;

export default axios.create({
  baseURL: `http://localhost:${PORT}`,
  headers: {
    'x-secret-token': SECRET,
    Cookie: { token: 'asddasddsadsds' },
  },
});
