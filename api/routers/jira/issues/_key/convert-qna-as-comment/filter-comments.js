/*
 * return false in traverse means delete
 */

import { diff } from 'deep-object-diff';
import { isEmpty, cloneDeep } from 'lodash';
import { traverse, filter } from '@atlaskit/adf-utils/traverse';

const isEqual = (a, b) => isEmpty(diff(a, b));

const extractTexts = adf => filter(adf, ({ type }) => type === 'text');

export default (commentAdf, existingComments) => {
  const clonedCommentAdf = cloneDeep(commentAdf);

  const noExistingComments = traverse(clonedCommentAdf, {
    listItem: (node, parent, index) => {
      const isExist = existingComments.some(existingComment => (
        isEqual(extractTexts(existingComment), extractTexts(node))
      ));

      if (isExist) return false;
    },
  });

  const noEmptyGroup = traverse(noExistingComments, {
    paragraph: (node, parent, index, depth) => {
      const { content: parentContent } = parent.node;

      if (depth > 1) return;

      if (parentContent.length - 1 === index) return false;

      const nextSibling = parentContent[index + 1];
      if (nextSibling.type === 'bulletList' && !nextSibling.content.length) {
        return false;
      }
    },
    bulletList: (node, parent, index) => {
      if (!node.content.length) return false;
    },
  });

  return noEmptyGroup;
};
