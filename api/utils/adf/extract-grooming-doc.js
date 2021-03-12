import { pick } from 'lodash';
import { traverse, filter, reduce } from '@atlaskit/adf-utils/traverse';
import * as adf from '@atlaskit/adf-utils/builders';

const isContainingText = node => !!filter(node, child => (
  child.type === 'paragraph' && child.content
)).length;

const extractQnA = (taskList) => {
  const list = reduce(
    taskList,
    (acc, item) =>
      item.type === 'taskItem' &&
      !(item.content.length === 1 && item.content[0].text === '-')
        ? [...acc, adf.listItem([adf.p(...item.content)])]
        : acc,
    [],
  );

  return list.length ? adf.bulletList(...list) : null;
};

const sanitizeAdf = adf => traverse(adf, {
  text: (node) => {
    const links = (node.marks || []).filter(mark => mark.type === 'link');

    links.forEach((link) => {
      link.attrs = pick(link.attrs, ['href']);
    });

    return node;
  },
});

export default (doc) => {
  const tables = filter(doc, node => node.type === 'table');

  return tables.map((table) => {
    const [firstRow, , , fourthRow, , , seventhRow] = filter(table, ({ type }) => {
      return type === 'tableRow';
    });

    const [keyCell, storyPointsCell] = filter(
      firstRow,
      ({ type }) => type === 'tableHeader',
    );

    const [acceptanceCell, detailCell, constraintsCell, commentsCell] = filter(
      fourthRow,
      ({ type }) => type === 'tableCell',
    );

    const [questionsCell, actionsCell] = filter(
      commentsCell,
      ({ type }) => type === 'taskList',
    );

    const [descriptionCell, componentsCell] = filter(
      seventhRow,
      ({ type }) => type === 'tableCell',
    );

    const questionsAdf = extractQnA(questionsCell);
    const actionsAdf = extractQnA(actionsCell);

    return {
      key: reduce(
        keyCell,
        (acc, { attrs, type }) => (
          type === 'inlineCard'
            ? attrs.url.split('/').pop()
            : acc
        ),
        '',
      ),

      story_points: reduce(
        storyPointsCell,
        (acc, { text, type }) => (
          type === 'text'
            ? (() => {
              const pointText = text.replace(/[^\d.]/g, '');
              return pointText ? parseFloat(pointText) : null;
            })()
            : acc
        ),
        null,
      ),

      acceptances_adf: isContainingText(acceptanceCell)
        ? sanitizeAdf(adf.doc(...acceptanceCell.content))
        : null,

      implementation_adf: isContainingText(detailCell)
        ? sanitizeAdf(adf.doc(...detailCell.content))
        : null,

      constratints_adf: isContainingText(constraintsCell)
        ? sanitizeAdf(adf.doc(...constraintsCell.content))
        : null,

      comment_adf: !questionsAdf && !actionsAdf
        ? null
        : sanitizeAdf(adf.doc(
          ...(questionsAdf ? [
            adf.p(adf.underline(adf.text('Questions:'))),
            questionsAdf,
          ] : []),

          ...(actionsAdf ? [
            adf.p(adf.underline(adf.text('Actions:'))),
            actionsAdf,
          ] : []),
        )),

      description_adf: isContainingText(descriptionCell)
        ? sanitizeAdf(adf.doc(...descriptionCell.content))
        : null,

      components: reduce(
        componentsCell,
        (acc, { type, attrs }) => (
          type === 'taskItem' && attrs.state === 'DONE'
            ? [...acc, attrs.localId]
            : acc
        ),
        [],
      ),
    };
  });
};
