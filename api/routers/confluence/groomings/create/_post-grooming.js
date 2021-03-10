import { sprintf } from 'sprintf-js';
import { GROOMING_TITLE } from '~/api/constants/variables';
import getActiveSprint from './_get-active-sprint';
import getJiraComponents from './_get-jira-components';
import postGroomingNew from './_post-grooming--new';

export default async ({ issues }) => {
  const activeSprint = await getActiveSprint();
  const components = await getJiraComponents();

  const title = sprintf(GROOMING_TITLE, activeSprint.name);

  return postGroomingNew({ issues, title, components });
};
