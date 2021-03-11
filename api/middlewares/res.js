export default (req, res, next) => {
  res.error = (err) => {
    console.error(new Error('Error stack trace').stack);

    return res
      .status(err.status || err.response.status)
      .send({ message: err.message });
  };

  next();
};
