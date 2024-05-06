const {
  addPerson,
  getPersonByEmail,
  getPersonById,
} = require("../utils/personUtils");
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
  try {
    const actualPersonId = req.params.id ? req.params.id : req.body.id;
    if (!(await getPersonById(actualPersonId))) {
      throw new Error("Person ID not found");
    }
    if (await getPersonByEmail(email)) {
      throw new Error("La personne existe déjà");
    }
    const personToAddData = req.body;
    const addedPersonId = await handleAddRelation(
      actualPersonId,
      personToAddData
    );
    res.json({
      message: "Relation ajoutée avec succès",
      personId: addedPersonId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleAddRelation = async (actualPersonId, personToAddData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, relation, dateUnion, dateSeparation } = personToAddData;

    let addedPerson;
    if (relation === "pere") {
      if (actualPerson.parents && actualPerson.parents.pere) {
        throw new Error("La personne a déjà un père");
      }
      addedPerson = await addPerson({
        ...personToAddData,
        enfants: [{ idEnfant: actualPerson._id }],
      });
      actualPerson.parents.pere = addedPerson._id;
      actualPerson.markModified("parents.pere");
    } else if (relation === "mere") {
      if (actualPerson.parents && actualPerson.parents.mere) {
        throw new Error("La personne a déjà une mère");
      }
      addedPerson = await addPerson({
        ...personToAddData,
        enfants: [{ idEnfant: actualPerson._id }],
      });
      actualPerson.parents.mere = addedPerson._id;
      actualPerson.markModified("parents.mere");
    } else if (relation === "conjoint") {
      addedPerson = await addPerson(personToAddData);
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
    } else if (relation === "enfant") {
      addedPerson = await addPerson(personToAddData);
      actualPerson.enfants.push({
        idEnfant: addedPerson._id,
      });
      if (actualPerson.sexe === "Homme") {
        addedPerson.parents.pere = actualPerson._id;
      } else {
        addedPerson.parents.mere = actualPerson._id;
      }
      actualPerson.markModified("enfants");
    } else {
      throw new Error("Relation non valide");
    }

    await actualPerson.save();

    if (relation === "conjoint" || relation === "enfant") {
      await addedPerson.save();
    }
    await session.commitTransaction();
    return addedPerson._id;
  } catch (err) {
    console.error("Transaction error in addRelation:", err);
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

const getPerson = async (req, res, next) => {
  try {
    const personId = req.params.id;
    let person = await getPersonById(personId);

    person = person.toObject();
    delete person.__v;
    delete person.createdAt;
    delete person.updatedAt;

    if (!person) {
      throw new Error("Person not found");
    }
    return res.json(person);
  } catch (err) {
    next(err);
  }
};

const updateRelation = async (req, res, next) => {
  try {
    const actualPersonId = req.params.id ? req.params.id : req.body.id;
    if (!(await getPersonById(actualPersonId))) {
      throw new Error("Person ID not found");
    }
    const personToAddData = req.body;
    const addedPersonId = await handleUpdateRelation(
      actualPersonId,
      personToAddData
    );
    res.json({
      message: "Relation mise à jour avec succès",
      personId: addedPersonId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteRelation = async (req, res, next) => {
  try {
    const actualPersonId = req.params.id ? req.params.id : req.body.id;
    if (!(await getPersonById(actualPersonId))) {
      throw new Error("Person ID not found");
    }
    const personToAddData = req.body;
    const addedPersonId = await handleDeleteRelation(
      actualPersonId,
      personToAddData
    );
    res.json({
      message: "Relation supprimée avec succès",
      personId: addedPersonId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleDeleteRelation = (module.exports = {
  test,
  verifySession,
  addPerson,
  addRelation,
  getPerson,
  updateRelation,
  deleteRelation,
});
