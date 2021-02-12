import catchify from 'catchify';

import getLastGrooming from './_get-last-grooming';
import getSameTitle from './_get-same-title';
import createInitialPage from './_create-initial-page';
import createInitialContent from './_create-initial-content';
import insertIssuesData from './_insert-issues-data';

export default async ({ title: rawTitle, issues }) => {
  const [e0, lastGrooming] = await getLastGrooming();
  if (e0) console.error(e0.response.data);

  console.log(lastGrooming);

  const [e1, sameTitle] = await catchify(getSameTitle(rawTitle));
  if (e1) console.error(e1.response.data);

  const title = `${rawTitle} - ${sameTitle.length + 1}`;

  const [e2, pageData] = await catchify(createInitialPage(title));
  if (e2) console.error(e2.response.data);

  const { id, version } = pageData;

  const [e3] = await catchify(createInitialContent({
    id,
    issues,
    title,
    version: version.number + 1,
  }));

  if (e3) console.error(e3.response.data);

  const [e4, data] = await catchify(insertIssuesData({
    id,
    issues,
    title,
    version: version.number + 2,
  }));

  if (e4) console.error(e4.response.data);

  return data;
};
