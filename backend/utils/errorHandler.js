const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.error(`${err.message}: ${err}`);
  res.json({ error: err.message });
};

module.exports = errorHandler;
