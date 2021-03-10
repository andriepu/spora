import getActiveSprint from './_get-active-sprint';
import getJiraComponents from './_get-jira-components';
import postGroomingNew from './_post-grooming--new';

export default async ({ issues }) => {
  const activeSprint = await getActiveSprint();
  const components = await getJiraComponents();

  const title = `Grooming ${activeSprint.name}`;

  return postGroomingNew({ issues, title, components });
};
