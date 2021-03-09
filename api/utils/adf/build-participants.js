import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import { MEMBERS } from '~/api/constants';

export default participants => (
  participants.map(emailName => MEMBERS[emailName]
    ? adf.mention({ id: MEMBERS[emailName] })
    : adf.text(`@${emailName}`),
  )
);
