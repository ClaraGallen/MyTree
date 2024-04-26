const Person = require("../models/Person");

const addPerson = async (data) => {
  let person;
  try {
    const {
      nom,
      prenom,
      sexe,
      //photo = null,
      dateNaissance = null,
      dateDeces = null,
      professions = null,
      adresse = null,
      tel = null,
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
      dateNaissance,
      dateDeces,
      professions,
      adresse,
      tel,
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
