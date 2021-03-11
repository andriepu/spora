import { flatten } from 'lodash';
import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import axios from '~/api/modules/axios/--confluence';
import buildPageInfo from '~/api/utils/adf/build-page-info';
import buildSingleTable from './_build-single-table';

const { CONFLUENCE_GROOMING_PARENT_ID, SPACE_KEY } = process.env;

export default ({
  components,
  issues,
  title,
}) => axios.post('/content', {
  title,
  type: 'page',
  space: { key: SPACE_KEY },
  ancestors: [{ id: CONFLUENCE_GROOMING_PARENT_ID }],
  body: {
    atlas_doc_format: {
      value: JSON.stringify(adf.doc(
        buildPageInfo({ date: new Date() }),
        ...flatten(issues.map(issue => (
          buildSingleTable(issue, { components })
        ))),
      )),
      representation: 'atlas_doc_format',
    },
  },
  metadata: {
    properties: {
      'content-appearance-draft': {
        value: 'full-width',
      },
      'content-appearance-published': {
        value: 'full-width',
      },
    },
  },
}).then(({ data }) => data);
