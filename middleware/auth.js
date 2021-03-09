import { generateDailyMaxAge, generateToken } from '~/api/utils/token';

export default ({ app }) => {
  const token = generateToken();

  app.$cookies.set('token', token, {
    path: '/',
    maxAge: generateDailyMaxAge(),
    sameSite: true,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });
};
