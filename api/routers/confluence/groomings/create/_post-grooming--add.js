import { flatten } from 'lodash';
import * as adf from '@atlaskit/adf-utils/builders';
import axios from '~/api/modules/axios/--confluence';
import extractGroomingDoc from '~/api/utils/adf/extract-grooming-doc';
import buildSingleTable from './_build-single-table';

export default ({
  components,
  existing,
  issues,
}) => {
  const existingAdf = JSON.parse(existing.body.atlas_doc_format.value);
  const existingIssues = extractGroomingDoc(existingAdf);
  const existingKeys = existingIssues.map(({ key }) => key);

  const nonExistingIssues = issues.filter(({ key }) => (
    !existingKeys.includes(key)
  ));

  return axios.put(`/content/${existing.id}`, {
    title: existing.title,
    type: 'page',
    version: { number: existing.version.number + 1 },
    body: {
      atlas_doc_format: {
        value: JSON.stringify(
          adf.doc(
            ...existingAdf.content,
            ...flatten(nonExistingIssues.map(issue => (
              buildSingleTable(issue, { components })
            ))),
          ),
        ),
        representation: 'atlas_doc_format',
      },
    },
  }).then(({ data }) => data);
};
