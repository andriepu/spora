import { resolve } from 'path';
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '~': resolve(__dirname, '../'),
});

export default require('./server').default;
