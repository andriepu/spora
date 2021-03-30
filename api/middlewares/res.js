module.exports = (req, res, next) => {
  res.error = (err) => {
    if (err.stack) console.error(err.stack);

    return res
      .status(err.status || (err.response && err.response.status) || 500)
      .send({ message: err.message });
  };

  next();
};
