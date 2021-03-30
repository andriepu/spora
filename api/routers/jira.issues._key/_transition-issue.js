const axiosJira = require('~/api/modules/axios/--jira');

const { JIRA_TRANSITION_PATH = '' } = process.env;

module.exports = async (issueKey) => {
  const transitionPath = JIRA_TRANSITION_PATH.split(/,\s*/);

  while (transitionPath.length) {
    const availableTransitions = await axiosJira.get(`/issue/${issueKey}/transitions`)
      .then(({ data }) => data.transitions);

    const isNextTransitionFound = availableTransitions
      .some(({ id }) => id === transitionPath[0]);

    if (isNextTransitionFound) {
      await axiosJira.post(`/issue/${issueKey}/transitions`, {
        transition: { id: transitionPath[0] },
      });
    }

    transitionPath.shift();
  }
};
