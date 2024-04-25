const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    sexe: { type: String, required: true, enum: ["Homme", "Femme"] },
    photo: String,
    dateNaissance: Date,
    dateDeces: Date,
    professions: [String],
    coordonnees: {
      adresse: String,
      tel: String,
      mail: String,
    },
    informationsComplementaires: mongoose.Schema.Types.Mixed,
    parents: {
      pere: mongoose.Schema.Types.ObjectId,
      mere: mongoose.Schema.Types.ObjectId,
    },
    conjoints: [
      {
        idConjoint: mongoose.Schema.Types.ObjectId,
        dateUnion: Date,
        dateSeparation: Date,
      },
    ],
  },
  { timestamps: true }
);

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
