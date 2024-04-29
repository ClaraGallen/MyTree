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
    let actualUser = await getUserById(req.userId);
    let userWithPerson = await actualUser.populate("person");
    let actualPerson = userWithPerson.person;
    let addedPerson;
    if (relation === "pere") {
      if (actualPerson.parents && actualPerson.parents.pere) {
        throw new Error("La personne a déjà un père");
      }
      addedPerson = await addPerson({
        ...req.body,
        enfants: [{ idEnfant: actualPerson._id }],
      });
      actualPerson.parents = { ...actualPerson.parents, pere: addedPerson._id };
    } else if (relation === "mere") {
      if (actualPerson.parents && actualPerson.parents.mere) {
        throw new Error("La personne a déjà une mère");
      }
      addedPerson = await addPerson({
        ...req.body,
        enfants: [{ idEnfant: actualPerson._id }],
      });
      actualPerson.parents = { ...actualPerson.parents, mere: addedPerson._id };
    } else if (relation === "conjoint") {
      addedPerson = await addPerson(req.body);
      if (!actualPerson.conjoints) {
        actualPerson.conjoints = [];
      }
      actualPerson.conjoints.push({
        idConjoint: addedPerson._id,
        dateUnion,
        dateSeparation,
      });
    } else {
      throw new Error("Relation non valide");
    }
    console.log(actualPerson._id);
    await updatePerson(actualPerson._id, actualPerson);
    res.json({
      message: "Relation ajoutée avec succès",
      personId: addedPerson._id,
    });
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
