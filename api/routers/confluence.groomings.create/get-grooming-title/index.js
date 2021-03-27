const { sprintf } = require('sprintf-js');
const { GROOMING_TITLE } = require('~/api/constants/variables');
const getActiveSprint = require('./_get-active-sprint');

module.exports = async () => {
  const activeSprint = await getActiveSprint();
  return sprintf(GROOMING_TITLE, activeSprint.name);
};
