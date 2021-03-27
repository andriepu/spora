const adf = require('@atlaskit/adf-utils/builders');
const { MEMBERS } = require('~/api/constants/members');

module.exports = participants => (
  participants.map(emailName => MEMBERS[emailName]
    ? adf.mention({ id: MEMBERS[emailName] })
    : adf.text(`@${emailName}`),
  )
);
