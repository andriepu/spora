const { get } = require('lodash');

module.exports = (req, res, next) => {
  res.error = (err) => {
    if (err.stack) console.error(err.stack);

    return res
      .status(get(err, 'response.status') || err.status || 500)
      .send({
        errorMessages: [get(err, 'response.data.errorMessages[0]') || err.message],
      });
  };

  next();
};
