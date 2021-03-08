import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import membersByEmail from './../_members-by-email';

const { SQUAD_NAME } = process.env;

export const buildParticipants = participants => (
  participants.map(emailName => membersByEmail[emailName]
    ? adf.mention({ id: membersByEmail[emailName] })
    : adf.text(`@${emailName}`),
  )
);

export default ({ participants = Object.keys(membersByEmail), date }) => (
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
  )
);
