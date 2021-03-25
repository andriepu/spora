import axiosV2 from '~/api/modules/axios/--jira--v2';
import axiosInternal from '~/api/modules/axios/--internal';
import * as customfields from '~/api/constants/customfields';
import convertToConfluenceMedia from './_convert-to-confluence-media';
import uploadToConfluenceMedia from './_upload-to-confluence-media';

import {
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
} from '~/api/constants/customfields';

const fieldsWithEditor = [
  ACCEPTANCE_KEY,
  CONSTRAINTS_KEY,
  DESCRIPTION_KEY,
  IMPLEMENTATION_KEY,
];

const { PROJECT_KEY } = process.env;

export default (keys, { contentId }) => Promise.all([
  axiosInternal.get('/jira/search', {
    params: { keys: keys.join(',') },
  }).then(({ data }) => data.data),

  axiosV2.get('/search', {
    params: {
      jql: `project="${PROJECT_KEY}" AND key in (${keys}) ORDER BY RANK`,
      fields: Object.keys(customfields).map(k => customfields[k]).join(','),
    },
  }).then(({ data }) => data.issues),
]).then(async ([v3, v2]) => {
  const attachments = await v2.reduce(async (promise, issue) => {
    const confluenceAttachments = await issue.fields.attachment
      .reduce(async (promise1, att) => Promise.resolve({
        ...(await promise1),
        [att.filename]: await uploadToConfluenceMedia(att.content, att.filename, {
          contentId,
          existingAttachments: issue.fields.attachment,
        }),
      }), Promise.resolve({}));

    return Promise.resolve({
      ...(await promise),
      [issue.key]: fieldsWithEditor.reduce((acc1, key) => ({
        ...acc1,
        [key]: (issue.fields[key].match(/!(.*)?\|width=\d+,height=\d+!/g) || [])
          .map(att => ({
            ...confluenceAttachments[att.replace(/!(.*)?\|.*/, '$1')],
            height: Number(att.replace(/.*\|.*?height=(\d+).*/, '$1')),
            width: Number(att.replace(/.*\|.*?width=(\d+).*/, '$1')),
          })),
      }), {}),
    });
  }, Promise.resolve({}));

  return v3.map(issue => ({
    ...issue,
    fields: {
      ...issue.fields,
      ...(fieldsWithEditor.reduce((acc, fieldKey) => ({
        ...acc,
        [fieldKey]: convertToConfluenceMedia(issue.fields[fieldKey], {
          attachments: attachments[issue.key][fieldKey],
        }),
      }), {})),
    },
  }));
});
