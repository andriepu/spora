import md5 from 'md5';

export const generateToken = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return md5([
    process.env.SECRET,
    date.getTime(),
  ].join());
};

export const generateDailyMaxAge = () => {
  const endDayDate = new Date();
  endDayDate.setHours(23);
  endDayDate.setMinutes(59);
  endDayDate.setSeconds(59);
  endDayDate.setMilliseconds(59);

  return Math.floor((endDayDate.getTime() - Date.now()) / 1000);
};

export const checkValidToken = token => token === generateToken();
