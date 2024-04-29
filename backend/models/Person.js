const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    sexe: { type: String, required: true, enum: ["Homme", "Femme"] },
    photo: String,
    dateNaissance: Date,
    dateDeces: Date,
    professions: String,
    adresse: String,
    tel: String,
    informationsComplementaires: mongoose.Schema.Types.Mixed,
    parents: {
      pere: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
      mere: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    },
    conjoints: [
      {
        idConjoint: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
        dateUnion: Date,
        dateSeparation: Date,
      },
    ],
    enfants: [
      {
        idEnfant: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
      },
    ],
  },
  { timestamps: true }
);

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
