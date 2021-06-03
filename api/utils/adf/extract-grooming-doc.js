const { pick } = require('lodash');
const { traverse, filter, map, reduce } = require('@atlaskit/adf-utils/traverse');
const adf = require('@atlaskit/adf-utils/builders');
const {
  ACCEPTANCE_KEY,
  COMPONENTS_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
  STORY_POINTS_KEY,
} = require('~/api/constants/customfields');

const isFilled = node => map(node, child => child).length > 2;

const extractQnA = (taskList) => {
  const list = reduce(
    taskList,
    (acc, item) =>
      item.type === 'taskItem' &&
      item.content &&
      !(item.content.length === 1 && item.content[0].text === '-')
        ? [...acc, adf.listItem([adf.p(...item.content)])]
        : acc,
    [],
  );

  return list.length ? adf.bulletList(...list) : null;
};

const sanitizeAdf = adf => traverse(adf, {
  inlineCard (node) {
    node.attrs = pick(node.attrs, ['url']);

    return node;
  },
  text (node) {
    const links = (node.marks || []).filter(mark => mark.type === 'link');

    links.forEach((link) => {
      link.attrs = pick(link.attrs, ['href']);
    });

    return node;
  },
});

module.exports = (doc) => {
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
      ).replace(/\?.*$/, ''),

      [STORY_POINTS_KEY]: reduce(
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

      [ACCEPTANCE_KEY]: isFilled(acceptanceCell)
        ? sanitizeAdf(adf.doc(...acceptanceCell.content))
        : null,

      [IMPLEMENTATION_KEY]: isFilled(detailCell)
        ? sanitizeAdf(adf.doc(...detailCell.content))
        : null,

      [CONSTRAINTS_KEY]: isFilled(constraintsCell)
        ? sanitizeAdf(adf.doc(...constraintsCell.content))
        : null,

      comment: !questionsAdf && !actionsAdf
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

      [DESCRIPTION_KEY]: isFilled(descriptionCell)
        ? sanitizeAdf(adf.doc(...descriptionCell.content))
        : null,

      [COMPONENTS_KEY]: reduce(
        componentsCell,
        (acc, { attrs, content, type }) => (
          type === 'taskItem' && attrs.state === 'DONE'
            ? [...acc, content[0].text]
            : acc
        ),
        [],
      ),
    };
  });
};
