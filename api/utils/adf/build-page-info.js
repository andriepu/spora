const adf = require('@atlaskit/adf-utils/builders');
const { MEMBERS } = require('~/api/constants/members');
const buildParticipants = require('~/api/utils/adf/build-participants');

const { SQUAD_NAME } = process.env;

module.exports = ({ participants = Object.keys(MEMBERS), date }) => (
  adf.expand({ title: 'Page Information' })(
    adf.p(adf.strong('Date')),
    adf.ul(adf.listItem([
      adf.date({ timestamp: new Date(date).getTime() }),
    ])),

    adf.p(adf.strong('Team')),
    adf.ul(adf.listItem([
      adf.p(SQUAD_NAME),
    ])),

    adf.p(adf.strong('Participants')),
    adf.ul(...buildParticipants(participants).map(p => adf.listItem([p]))),

    adf.p(' '),
  )
);
