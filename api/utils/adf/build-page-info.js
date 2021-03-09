import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import { MEMBERS } from '~/api/constants';
import buildParticipants from '~/api/utils/adf/build-participants';

const { SQUAD_NAME } = process.env;

export default ({ participants = Object.keys(MEMBERS), date }) => (
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
