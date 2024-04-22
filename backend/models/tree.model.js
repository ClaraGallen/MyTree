const mongoose = require("mongoose");

const parentSchema = mongoose.Schema(
  {
    ParentId: {
      type: String,
      required: true,
    },
    FamilyName: {
      type: String,
      required: true,
    },
    FirstName: {
      type: String,
      required: true,
    },
    Genre: {
      type: String,
      required: true,
    },
    Picture: {
      type: String,
      required: false,
    },
    DateofBirth: {
      type: String,
      required: false,
    },
    DateofDeath: {
      type: String,
      required: false,
    },
    Profession: {
      type: String,
      required: false,
    },
    Contacts: {
      type: [String],
      required: false,
    },
    Info: {
      type: String,
      required: false,
    },
  },
);

const relationSchema = mongoose.Schema({
  RelationshipType: {
    type: String,
    enum: ["Parent", "Conjoints"],
    required: true,
  },
  MemberIds: {
    type: [String],
    required: true,
    validate: {
      validator: function () {
        if (this.RelationshipType === 'Parent') {
          return this.MemberIds.length === 1;
        } else if (this.RelationshipType === 'Conjoints') {
          return this.MemberIds.length === 2;
        }
        return false;
      },
      message: props => `Invalid number of members for relationship type ${props.value}`,
    },
  },
  DateofUnion: {
    type: Date,
    required: false,
  },
  DateofSeparation: {
    type: Date,
    required: false,
  },
});


module.exports = {
  Parent: mongoose.model("Parent", parentSchema),
  Relation: mongoose.model("Relation", relationSchema),
};
