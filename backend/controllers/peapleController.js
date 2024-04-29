const { addPerson, getPersonByEmail } = require("../utils/personUtils");
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
    const { email, relation, dateUnion, dateSeparation } = req.body;
    if (await getPersonByEmail(email)) {
      throw new Error("La personne existe déjà");
    }
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
      actualPerson.parents.pere = addedPerson._id;
      actualPerson.markModified("parents.pere");
    } else if (relation === "mere") {
      if (actualPerson.parents && actualPerson.parents.mere) {
        throw new Error("La personne a déjà une mère");
      }
      addedPerson = await addPerson({
        ...req.body,
        enfants: [{ idEnfant: actualPerson._id }],
      });
      actualPerson.parents.mere = addedPerson._id;
      actualPerson.markModified("parents.mere");
    } else if (relation === "conjoint") {
      addedPerson = await addPerson(req.body);
      actualPerson.conjoints.push({
        idConjoint: addedPerson._id,
        dateUnion,
        dateSeparation,
      });
      addedPerson.conjoints.push({
        idConjoint: actualPerson._id,
        dateUnion,
        dateSeparation,
      });
      actualPerson.markModified("conjoints");
    } else {
      throw new Error("Relation non valide");
    }

    await actualPerson.save();

    if (relation === "conjoint") {
      await addedPerson.save();
    }

    console.log("updatedActualPerson:", actualPerson);
    res.json({
      message: "Relation ajoutée avec succès",
      personId: addedPerson._id,
    });
    await session.commitTransaction();
  } catch (err) {
    console.error("Transaction error in addRelation:", err);
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
