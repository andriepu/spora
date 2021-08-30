const catchify = require('catchify');
const { traverse } = require('@atlaskit/adf-utils/traverse');
const { p, text } = require('@atlaskit/adf-utils/builders');
const axiosJira = require('~/api/modules/axios/--jira');
const axiosJiraV2 = require('~/api/modules/axios/--jira--v2');
const {
  COMPONENTS_KEY,
  STORY_POINTS_KEY,

  $fieldsWithEditor,
} = require('~/api/constants/customfields');

const MEDIA_IMAGE_SIGN = '@IMAGE_SIGN@';
const MEDIA_APP_SIGN = '@APP_SIGN@';

const MEDIA_SIGNS = [
  MEDIA_IMAGE_SIGN,
  MEDIA_APP_SIGN,
];

module.exports = async (issue, { jiraAttachments }) => {
  const jiraAttachmentMap = jiraAttachments.reduce((acc, att) => ({
    ...acc,
    [att.confluence_reference.id]: att,
  }), {});

  const mediaToText = adf => traverse(adf, {
    mediaGroup (node) {
      return p(text(node.content.map((content) => {
        if (content.attrs.__fileMimeType?.startsWith('application')) {
          const attRef = jiraAttachmentMap[content.attrs.id];
          return `${MEDIA_APP_SIGN}${attRef.filename}]`;
        }

        const attRef = jiraAttachmentMap[content.attrs.id];

        return [
          MEDIA_IMAGE_SIGN,
          attRef.filename,
          '|',
          `width=${attRef.confluence_reference.width},height=${attRef.confluence_reference.height}`,
          MEDIA_IMAGE_SIGN,
        ].join('');
      }).join('')));
    },
    mediaSingle (node) {
      const attRef = jiraAttachmentMap[node.content[0].attrs.id];

      return p(text([
        MEDIA_IMAGE_SIGN,
        attRef.filename,
        '|',
        `width=${attRef.confluence_reference.width},height=${attRef.confluence_reference.height}`,
        MEDIA_IMAGE_SIGN,
      ].join('')));
    },
  });

  const textToMedia = md => md
    .replace(new RegExp(MEDIA_IMAGE_SIGN, 'g'), '!')
    .replace(new RegExp(MEDIA_APP_SIGN, 'g'), '[^');

  // ---

  const [ePutV3] = await catchify(axiosJira.put(`/issue/${issue.key}`, {
    fields: {
      ...$fieldsWithEditor.reduce((acc, fieldKey) => ({
        ...acc,
        [fieldKey]: issue[fieldKey]
          ? mediaToText(issue[fieldKey])
          : null,
      }), {}),
      [COMPONENTS_KEY]: issue[COMPONENTS_KEY],
      [STORY_POINTS_KEY]: issue[STORY_POINTS_KEY],
    },
  }));

  if (ePutV3) throw ePutV3;

  const [
    eGetV2,
    issueV2,
  ] = await catchify(axiosJiraV2.get(`/issue/${issue.key}`, {
    params: { fields: $fieldsWithEditor.join(',') },
  }).then(({ data }) => data));

  if (eGetV2) throw eGetV2;

  const [ePutV2] = await catchify(axiosJiraV2.put(`/issue/${issue.key}`, {
    fields: {
      ...$fieldsWithEditor.reduce((acc, fieldKey) => ({
        ...acc,
        [fieldKey]: new RegExp(MEDIA_SIGNS.join('|')).test(issueV2.fields[fieldKey] || '')
          ? textToMedia(issueV2.fields[fieldKey])
          : issueV2.fields[fieldKey],
      }), {}),
    },
  }));

  if (ePutV2) throw ePutV2;

  const [
    eGetV3,
    issueV3,
  ] = await catchify(axiosJira.get(`/issue/${issue.key}`, {
    params: { fields: $fieldsWithEditor.join(',') },
  }).then(({ data }) => data));
  if (eGetV3) throw eGetV3;

  return axiosJira.put(`/issue/${issue.key}`, {
    fields: {
      ...$fieldsWithEditor.reduce((acc, fieldKey) => ({
        ...acc,
        [fieldKey]: issueV3.fields[fieldKey]
          ? traverse(issueV3.fields[fieldKey], {
            mediaSingle (node) {
              node.attrs.layout = 'align-start';
              return node;
            },
          }) : null,
      }), {}),
    },
  });
};
