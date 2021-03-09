const { MEMBERS: MEMBERS_RAW } = process.env;

export const MEMBERS = MEMBERS_RAW.split(',')
  .reduce((acc, m) => {
    const [id, emailName] = m.split('#');
    return { ...acc, [emailName]: id };
  }, {});
