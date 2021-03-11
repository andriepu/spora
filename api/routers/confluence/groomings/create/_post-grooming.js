import { sprintf } from 'sprintf-js';
import { GROOMING_TITLE } from '~/api/constants/variables';
import getActiveSprint from './_get-active-sprint';
import getExistingByTitle from './_get-existing-by-title';
import getJiraComponents from './_get-jira-components';
import postGroomingAdd from './_post-grooming--add';
import postGroomingNew from './_post-grooming--new';

export default async ({ issues }) => {
  const activeSprint = await getActiveSprint();
  const components = await getJiraComponents();

  const title = sprintf(GROOMING_TITLE, activeSprint.name);

  const existing = await getExistingByTitle(title);

  return existing
    ? postGroomingAdd({ issues, components, existing })
    : postGroomingNew({ issues, components, title });
};
