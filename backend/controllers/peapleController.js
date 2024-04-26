const User = require("../models/User");

const test = (req, res, next) => {
  res.json("Le test de route 'peaple' fonctionne");
};

const addPerson = (req, res, next) => {};

module.exports = {
  test,
  addPerson,
};
