const adf = require('@atlaskit/adf-utils/builders');
const buildParticipants = require('~/api/utils/adf/build-participants');

module.exports = text => text.split(/(@[\w.]+)/).filter(Boolean)
  .map(subtext => /^@[\w.]+$/.test(subtext)
    ? buildParticipants([subtext.substr(1)])[0]
    : adf.text(subtext),
  );
