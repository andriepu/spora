import catchify from 'catchify';
import getJiraComponents from './_get-jira-components';
import addComment from './_add-comment';
import filterComments from './_filter-comments';
import getExistingComments from './_get-existing-comments';
import patchIssue from './_patch-issue';

export const patch = async (req, res) => {
  const { key } = req.params;
  const { issue } = req.body;

  const [errComponents, components] = await catchify(getJiraComponents());

  if (errComponents) return res.error(errComponents);

  const filteredComponents = components
    .filter(({ id }) => issue.components.includes(id));

  const update = {
    ...issue,
    components: filteredComponents,
  };

  const [eUpdate] = await catchify(patchIssue(key, update));

  if (eUpdate) return res.error(eUpdate);

  if (issue.comment_adf) {
    const [eExistingComments, existingComments] = await catchify(
      getExistingComments(key),
    );

    if (eExistingComments) return res.error(eExistingComments);

    const filteredComments = filterComments(issue.comment_adf, existingComments);

    const [eAddComment] = await catchify(addComment(key, filteredComments));

    if (eAddComment) return res.error(eAddComment);
  }

  return res.status(204).send();
};
