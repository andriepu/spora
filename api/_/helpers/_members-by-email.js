const { MEMBERS } = process.env;

export default MEMBERS.split(',')
  .reduce((acc, m) => {
    const [id, emailName] = m.split('#');
    return { ...acc, [emailName]: id };
  }, {});
