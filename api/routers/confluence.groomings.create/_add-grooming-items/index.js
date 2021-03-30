const adf = require('@atlaskit/adf-utils/builders');
const axiosConfluence = require('~/api/modules/axios/--confluence');
const buildSingleTable = require('./_build-single-table');
const getJiraComponents = require('./_get-jira-components');

module.exports = async ({ groomingDoc, groomingAdf, issues }) => {
  const components = await getJiraComponents();

  return axiosConfluence.put(`/content/${groomingDoc.id}`, {
    title: groomingDoc.title,
    type: 'page',
    version: { number: groomingDoc.version.number + 1 },
    body: {
      atlas_doc_format: {
        value: JSON.stringify(
          adf.doc(
            ...groomingAdf.content,
            ...issues.map(issue => (
              buildSingleTable(issue, { components })
            )),
          ),
        ),
        representation: 'atlas_doc_format',
      },
    },
  }).then(({ data }) => data);
};
