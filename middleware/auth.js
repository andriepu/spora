import { generateDailyMaxAge, generateToken } from '~/api/utils/token';

export default ({ app }) => {
  const token = generateToken();

  app.$cookies.set('token', token, {
    path: '/',
    maxAge: generateDailyMaxAge(),
    sameSite: true,
    secure: true,
    httpOnly: true,
  });
};
