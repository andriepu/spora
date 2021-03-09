import { pick } from 'lodash';
import axios from '~/api/modules/axios/--jira';

const { PROJECT_KEY } = process.env;

export default () => axios.get(`/project/${PROJECT_KEY}/components`)
  .then(({ data }) => (
    data.map(component => pick(component, ['id', 'name']))
  ));
