const Person = require("../models/Person");

const addPerson = async (data) => {
  let person;
  try {
    const {
      nom,
      prenom,
      sexe,
      photo = null,
      dateNaissance = null,
      dateDeces = null,
      professions = null,
      adresse = null,
      tel = null,
      parents = null,
      conjoints = [],
      enfants = [],
    } = data;
    if (!nom) {
      throw new Error("Le nom est requis");
    }
    if (!prenom) {
      throw new Error("Le prenom est requis");
    }
    if (!sexe) {
      throw new Error("Le sexe est requis");
    }

    const person = await Person.create({
      nom,
      prenom,
      sexe,
      photo,
      dateNaissance,
      dateDeces,
      professions,
      adresse,
      tel,
      parents,
      conjoints,
      enfants,
    });

    return person;
  } catch (err) {
    if (person) {
      await Person.deleteOne({ _id: person._id });
    }
    throw err;
  }
};

const getPersonById = async (personId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error("Person not found");
    }
    return person;
  } catch (err) {
    throw new Error(err);
  }
};

const updatePerson = async (personId, data) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error("Person not found");
    }
    const {
      nom,
      prenom,
      sexe,
      photo = null,
      dateNaissance = null,
      dateDeces = null,
      professions = null,
      adresse = null,
      tel = null,
      parents = null,
      conjoints = null,
      enfants = null,
    } = data;
    if (nom) {
      person.nom = nom;
    }
    if (prenom) {
      person.prenom = prenom;
    }
    if (sexe) {
      person.sexe = sexe;
    }
    if (photo) {
      person.photo = photo;
    }
    if (dateNaissance) {
      person.dateNaissance = dateNaissance;
    }
    if (dateDeces) {
      person.dateDeces = dateDeces;
    }
    if (professions) {
      person.professions = professions;
    }
    if (adresse) {
      person.adresse = adresse;
    }
    if (tel) {
      person.tel = tel;
    }
    if (parents) {
      person.parents = parents;
    }
    if (conjoints) {
      person.conjoints = conjoints;
    }
    if (enfants) {
      person.enfants = enfants;
    }
    await person.save();
    return person;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  addPerson,
  getPersonById,
  updatePerson,
};
