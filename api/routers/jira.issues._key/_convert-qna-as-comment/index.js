const catchify = require('catchify');
const filterComments = require('./_filter-comments');
const getExistingComments = require('./_get-existing-comments');
const postComment = require('./_post-comment');

module.exports = async (issue) => {
  if (!issue.comment) return;

  const [
    eExistingComments,
    existingComments,
  ] = await catchify(getExistingComments(issue.key));
  if (eExistingComments) throw eExistingComments;

  const filteredComments = filterComments(issue.comment, existingComments);

  return postComment(issue.key, filteredComments);
};
