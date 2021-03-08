import * as adf from '@atlaskit/adf-utils/dist/esm/builders';
import { buildParticipants } from './_build-page-info';

export default text => text.split(/(@[\w.]+)/).filter(Boolean)
  .map(subtext => /^@[\w.]+$/.test(subtext)
    ? buildParticipants([subtext.substr(1)])[0]
    : adf.text(subtext),
  );
