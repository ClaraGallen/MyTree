const PostModel = require("../models/tree.model");

module.exports.testTree = async (req, res) => {
  console.log("test réussi");
};


module.exports.CreateParent = async (req, res) => {
  console.log("parent");
  try {
    const { ParentId, FamilyName, FirstName, Genre, Picture, DateofBirth, DateofDeath, Profession, Contacts, Info } = req.body;
    // Créer un nouvel objet parent avec les données reçues du frontend
    const newParent = new PostModel.Parent({
      ParentId,
      FamilyName,
      FirstName,
      Genre,
      Picture,
      DateofBirth,
      DateofDeath,
      Profession,
      Contacts,
      Info,
    });
    // Enregistrer le nouvel objet parent dans la base de données
    await newParent.save();
    // Répondre avec un message de succès
    res.status(201).json({ message: "Parent créé avec succès !" });
  } catch (error) {
    // En cas d'erreur, répondre avec un code d'erreur et un message d'erreur
    console.error("Error creating parent:", error);
    res.status(500).json({ message: "Erreur lors de la création du parent." });
  }
};


module.exports.CreateRelation = async (req, res) => {
  try {
    const { MemberIds, RelationshipType, DateofUnion, DateofSeparation } = req.body;

    console.log(MemberIds);
    
    let memberIds;
    if (RelationshipType === "Parent") {
      memberIds = MemberIds[0]; // Utiliser uniquement le premier ID pour une relation parent
    } else if (RelationshipType === "Conjoints") {
      memberIds = MemberIds; // Utiliser les deux premiers IDs pour une relation de conjoints
    } else {
      throw new Error("Type de relation non valide");
    }

    console.log(memberIds);

    // Créer un nouvel objet relation avec les données reçues du frontend
    const newRelation = new PostModel.Relation({
      MemberIds: memberIds,
      RelationshipType: RelationshipType,
      DateofUnion: DateofUnion,
      DateofSeparation: DateofSeparation,
    });

    // Enregistrer le nouvel objet relation dans la base de données
    await newRelation.save();

    // Répondre avec un message de succès
    res.status(201).json({ message: "Relation créée avec succès !" });
  } catch (error) {
    // En cas d'erreur, répondre avec un code d'erreur et un message d'erreur
    console.error("Error creating relation:", error);
    res.status(500).json({ message: "Erreur lors de la création de la relation." });
  }
};
