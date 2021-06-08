const catchify = require('catchify');
const extractGroomingDoc = require('~/api/utils/adf/extract-grooming-doc');

const getGroomingById = require('./_get-grooming-by-id');
const getIssuesDetail = require('./_get-issues-detail');

const {
  SUMMARY_KEY,
} = require('~/api/constants/customfields');

exports.get = async (req, res, next) => {
  const docId = req.params.id.replace(/\D/g, '');

  if (!docId) return res.error({ status: 400, message: 'invalid parameter : id' });

  const [eGroomingDoc, groomingDoc] = await catchify(getGroomingById(docId));
  if (eGroomingDoc) return res.error(eGroomingDoc);

  const groomingAdf = JSON.parse(groomingDoc.body.atlas_doc_format.value);
  const groomingData = extractGroomingDoc(groomingAdf);

  const keys = groomingData.map(({ key }) => key);
  const [eSummaries, summaries] = await catchify(
    getIssuesDetail(keys).then((data = []) => data.reduce((acc, { key, fields }) => ({
      ...acc,
      [key]: fields[SUMMARY_KEY],
    }), {})),
  );

  if (eSummaries) return res.error(eSummaries);

  const issues = groomingData.map((data, i) => ({
    ...data,
    summary: summaries[data.key],
  }));

  res.json({ data: issues });
};
