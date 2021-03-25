export default (req, res, next) => {
  res.error = (err) => {
    console.error(new Error('Stack trace').stack);

    return res
      .status(err.status || (err.response && err.response.status) || 500)
      .send({ message: err.message });
  };

  next();
};
