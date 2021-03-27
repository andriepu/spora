const { MEMBERS: MEMBERS_RAW } = process.env;

exports.MEMBERS = MEMBERS_RAW.split(',')
  .reduce((acc, m) => {
    const [id, emailName] = m.split('#');
    return { ...acc, [emailName]: id };
  }, {});
