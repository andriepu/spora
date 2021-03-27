const adf = require('@atlaskit/adf-utils/builders');
const axios = require('~/api/modules/axios/--confluence');
const buildSingleTable = require('./_build-single-table');

module.exports = async ({
  components,
  existing,
  issueKeys,
}) => {
  // const newBody = JSON.stringify(
  //   adf.doc(
  //     ...existingAdf.content,
  //     ...issuesDetail.map(issue => (
  //       buildSingleTable(issue, { components })
  //     )),
  //   ),
  // );

  // return axios.put(`/content/${existing.id}`, {
  //   title: existing.title,
  //   type: 'page',
  //   version: { number: existing.version.number + 1 },
  //   body: {
  //     atlas_doc_format: {
  //       value: newBody,
  //       representation: 'atlas_doc_format',
  //     },
  //   },
  // }).then(({ data }) => data);
};
