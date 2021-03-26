import catchify from 'catchify';
import convertToJiraMedia from './_convert-to-jira-media';
import deleteAllJiraAttachments from './_delete-all-jira-attachments';
import getJiraComponents from './_get-jira-components';

import {
  ACCEPTANCE_KEY,
  COMPONENTS_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
} from '~/api/constants/customfields';

const fieldsWithEditor = [
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
];

export default async ({
  docId,
  issue,
}) => {
  const [errComponents, components] = await catchify(getJiraComponents());
  if (errComponents) throw errComponents;

  const [eDeleteAtt] = await catchify(deleteAllJiraAttachments(issue.key));
  if (eDeleteAtt) throw eDeleteAtt;

  const [eConfluenceAttachments, confluenceAttachments] = await catchify(
    getConfluenceAttachments(docId),
  );

  if (eConfluenckkjjeAttachments) throw eConfluenceAttachments;


  const filteredComponents = components
    .filter(({ name }) => issue[COMPONENTS_KEY].includes(name));

  return {
    ...issue,
    components: filteredComponents,
    ...(await fieldsWithEditor.reduce(async (promise, fieldKey) => Promise.resolve({
      ...(await promise),
      [fieldKey]: issue[fieldKey]
        ? await convertToJiraMedia(issue[fieldKey], confluenceAttachments)
        : null,
    }), Promise.resolve({}))),
  };
};
