const { resolve } = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '~': resolve(__dirname, '../'),
});

module.exports = require('./server');
