export default (raw) => {
  const json = JSON.parse(raw);

  const actionsAndNotes = json.Actions
    .reduce(({ actions, notes }, { content }) => (
      content.match(/(\s+|^)@[\w.]+(\s+|$)/g)
        ? { notes, actions: [...actions, content] }
        : { actions, notes: [...notes, content] }
    ), { actions: [], notes: [] });

  const participants = (raw.match(/"email": "(.*)@/g) || [])
    .map(emaildata => emaildata.replace(/.*: "([\w.]+)@/, '$1'))
    .filter((item, i, arr) => arr.indexOf(item) === i);

  delete json.Actions;

  const contents = Object.keys(json).reduce((acc, column) => ({
    ...acc,
    [column]: [...json[column]]
      .sort((a, b) => b.votes - a.votes)
      .map(({ content, votes }) => `${content} – ${votes} vote(s)`),
  }), {});

  const [date] = (raw.match(/"date": "20\d{2}-\d{2}-\d{2}.*"/g) || [])
    .map(datedata => datedata.replace(/.*(20\d{2}-\d{2}-\d{2}).*"/, '$1'))
    .filter((item, i, arr) => arr.indexOf(item) === i);

  return {
    ...actionsAndNotes,
    date,
    contents,
    participants,
  };
};
