const {
  addPerson,
  getPersonByEmail,
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
  try {
    const actualUser = await getUserById(req.userId);
    if (!actualUser) {
      throw new Error("User not found");
    }
    let personId = actualUser.person;
    personId = req.params.id ? req.params.id : personId;
    const personToAddData = req.body;
    const addedPersonId = await handleAddRelation(personId, personToAddData);
    res.json({
      message: "Relation ajoutée avec succès",
      personId: addedPersonId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleAddRelation = async (personId, personToAddData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, relation, dateUnion, dateSeparation } = personToAddData;
    if (await getPersonByEmail(email)) {
      throw new Error("La personne existe déjà");
    }
    let actualPerson = await getPersonById(personId);
    if (!actualPerson) {
      throw new Error("Person not found");
    }

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

const addRelationByEmail = async (req, res, next) => {
  try {
    const actualUser = await getUserById(req.userId);
    if (!actualUser) {
      throw new Error("User not found");
    }
    let personId = actualUser.person;
    personId = req.params.id ? req.params.id : personId;
    const personToAddData = req.body;
    const addedPersonId = await handleAddExistingRelation(
      personId,
      req.params.email,
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

const handleAddExistingRelation = async (
  personId,
  personToAddMail,
  personToAddData
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { relation, dateUnion, dateSeparation } = personToAddData;
    if (!relation) {
      throw new Error("Relation field is required");
    }
    let actualPerson = await getPersonById(personId);
    if (!actualPerson) {
      throw new Error("Person not found");
    }
    let addedPerson = await getPersonByEmail(personToAddMail);
    if (!addedPerson) {
      throw new Error("Person to add not found");
    }
    if (relation === "pere") {
      if (actualPerson.parents && actualPerson.parents.pere) {
        throw new Error("La personne a déjà un père");
      }
      addedPerson = await updatePerson(addedPerson._id, {
        enfants: [
          ...(addedPerson.enfants || []),
          { idEnfant: actualPerson._id },
        ],
      });
      actualPerson.parents.pere = addedPerson._id;
      actualPerson.markModified("parents.pere");
      addedPerson.markModified("enfants");
    } else if (relation === "mere") {
      if (actualPerson.parents && actualPerson.parents.mere) {
        throw new Error("La personne a déjà une mère");
      }
      addedPerson = await updatePerson(addedPerson._id, {
        enfants: [
          ...(addedPerson.enfants || []),
          { idEnfant: actualPerson._id },
        ],
      });
      actualPerson.parents.mere = addedPerson._id;
      actualPerson.markModified("parents.mere");
      addedPerson.markModified("enfants");
    } else if (relation === "conjoint") {
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
      addedPerson.markModified("conjoints");
    } else if (relation === "enfant") {
      actualPerson.enfants.push({
        idEnfant: addedPerson._id,
      });
      if (actualPerson.sexe === "Homme") {
        if (addedPerson.parents && addedPerson.parents.pere) {
          throw new Error("La personne a déjà un père");
        }
        addedPerson.parents.pere = actualPerson._id;
      } else {
        if (addedPerson.parents && addedPerson.parents.mere) {
          throw new Error("La personne a déjà un mère");
        }
        addedPerson.parents.mere = actualPerson._id;
      }
      actualPerson.markModified("enfants");
      addedPerson.markModified("parents");
    } else {
      throw new Error("Relation non valide");
    }

    await actualPerson.save();
    await addedPerson.save();
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
    if (!person) {
      throw new Error("Person not found");
    }

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

const updateRelationController = async (req, res, next) => {
  try {
    const actualUser = await getUserById(req.userId);
    if (!actualUser) {
      throw new Error("User not found");
    }
    let personId = actualUser.person;
    personId = req.params.id ? req.params.id : personId;
    if (!(await getPersonById(personId))) {
      throw new Error("Person ID not found");
    }
    const personToUpdateData = req.body;
    const updatedPersonId = await handleUpdatePerson(
      personId,
      personToUpdateData
    );
    res.json({
      message: "Relation mise à jour avec succès",
      personId: updatedPersonId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleUpdatePerson = async (personId, personToUpdateData) => {
  const updatedPerson = await updatePerson(personId, personToUpdateData);
  return updatedPerson._id;
};

const deleteRelation = async (req, res, next) => {
  try {
    if (!req.params.id)
      throw new Error(
        "Please provide a person ID in the URL to delete the relation."
      );
    const actualPersonId = req.params.id;
    if (!(await getPersonById(actualPersonId))) {
      throw new Error("Person ID not found");
    }
    const deletedPeronId = await handleDeleteRelation(actualPersonId);
    res.json({
      message: "Relation supprimée avec succès",
      personId: deletedPeronId,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const handleDeleteRelation = async (actualPersonId) => {};

module.exports = {
  test,
  verifySession,
  addPerson,
  addRelation,
  addRelationByEmail,
  getPerson,
  updateRelationController,
  deleteRelation,
};
