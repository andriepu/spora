const createInitialDoc = require('./_create-initial-doc');
const getExistingByTitle = require('./_get-existing-by-title');

module.exports = async (title) => {
  return (await getExistingByTitle(title)) || (await createInitialDoc(title));
};
