import { flatten } from 'lodash';
import { filter } from '@atlaskit/adf-utils/traverse';
import axios from '~/api/modules/axios/--jira';

export default key => axios.get(`/issue/${key}/comment`)
  .then(({ data }) => {
    const { comments } = data;

    return flatten(comments.map(({ body }) => (
      filter(body, node => node.type === 'listItem')
    )));
  });
