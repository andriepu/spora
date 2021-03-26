import catchify from 'catchify';

import postComment from './post-comment';
import filterComments from './filter-comments';
import getExistingComments from './get-existing-comments';

export default async (issue) => {
  if (!issue.comment) return;

  const [
    eExistingComments,
    existingComments,
  ] = await catchify(getExistingComments(issue.key));
  if (eExistingComments) throw eExistingComments;

  const filteredComments = filterComments(issue.comment, existingComments);

  return postComment(issue.key, filteredComments);
};
