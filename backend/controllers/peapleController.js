const {
  addPerson,
  getPersonById,
  updatePerson,
} = require("../utils/personUtils");
const { getUserById } = require("../utils/userUtils");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const test = (req, res, next) => {
  res.json("Le test de route 'peaple' fonctionne");
};

const verifySession = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }
      req.userId = decoded.userId;
    });
    next();
  } catch (err) {
    next(err);
  }
};

const addRelation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { relation, dateUnion, dateSeparation } = req.body;
    const addedPerson = await addPerson(req.body);
    console.log(req.userId);
    const actualPerson = await getUserById(req.userId).Person;
    if ((relation = "pere")) {
      actualPerson.parents.pere = addedPerson._id;
    } else if ((relation = "mere")) {
      actualPerson.parents.mere = addedPerson._id;
    } else if ((relation = "conjoint")) {
      actualPerson.conjoints.push({
        idConjoint: addedPerson._id,
        dateUnion,
        dateSeparation,
      });
    } else {
      throw new Error("Relation non valide");
    }
    await updatePerson(actualPerson);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  test,
  verifySession,
  addPerson,
  addRelation,
};
