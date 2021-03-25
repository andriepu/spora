import * as adf from '@atlaskit/adf-utils/builders';
import axios from '~/api/modules/axios/--confluence';
import extractGroomingDoc from '~/api/utils/adf/extract-grooming-doc';
import buildSingleTable from './_build-single-table';
import getIssuesDetail from './_get-issues-detail';

export default async ({
  components,
  existing,
  issueKeys,
}) => {
  const existingAdf = JSON.parse(existing.body.atlas_doc_format.value);
  const existingIssues = extractGroomingDoc(existingAdf);
  const existingKeys = existingIssues.map(({ key }) => key);

  const nonExistingIssueKeys = issueKeys.filter(key => (
    !existingKeys.includes(key)
  ));

  if (!nonExistingIssueKeys.length) return existing;

  const issuesDetail = await getIssuesDetail(nonExistingIssueKeys, {
    contentId: existing.id,
  });

  const newBody = JSON.stringify(
    adf.doc(
      ...existingAdf.content,
      ...issuesDetail.map(issue => (
        buildSingleTable(issue, { components })
      )),
    ),
  );

  return axios.put(`/content/${existing.id}`, {
    title: existing.title,
    type: 'page',
    version: { number: existing.version.number + 1 },
    body: {
      atlas_doc_format: {
        value: newBody,
        representation: 'atlas_doc_format',
      },
    },
  }).then(({ data }) => data);
};
