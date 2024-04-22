import React, { useState } from 'react';
import axios from 'axios';

export default function CreateRelationPage() {
  const [relationData, setRelationData] = useState({
    MemberIds: ['', ''],
    RelationshipType: '',
    DateofUnion: '',
    DateofSeparation: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRelationData({
      ...relationData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Récupérer les données de la relation
      const { RelationshipType, DateofUnion, DateofSeparation, MemberIds } = relationData;

      // Créer un nouvel objet relation avec les données reçues du frontend
      const newRelation = {
        MemberIds,
        RelationshipType,
        DateofUnion,
        DateofSeparation,
      };

      console.log(newRelation);

      // Appel à l'API pour créer une relation
      await axios.post('/tree/relation', newRelation);
      alert('Relation créée avec succès !');

      // Réinitialiser les champs du formulaire
      setRelationData({
        MemberIds: ['', ''],
        RelationshipType: '',
        DateofUnion: '',
        DateofSeparation: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création de la relation :', error);
      alert('Erreur lors de la création de la relation.');
    }
  };

  return (
    <div>
      <h1>Créer une relation</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Type de relation :
          <select
            name="RelationshipType"
            value={relationData.RelationshipType}
            onChange={handleInputChange}
          >
            <option value="">Sélectionnez le type de relation</option>
            <option value="Parent">Parent</option>
            <option value="Conjoints">Conjoints</option>
          </select>
        </label>
        <label>
          ID du premier membre :
          <input
            type="text"
            name="MemberIds"
            value={relationData.MemberIds[0]}
            onChange={(e) => handleInputChangeForMember(0, e)}
          />
        </label>
        {relationData.RelationshipType === 'Conjoints' && (
          <label>
            ID du deuxième membre :
            <input
              type="text"
              name="MemberIds"
              value={relationData.MemberIds[1]}
              onChange={(e) => handleInputChangeForMember(1, e)}
            />
          </label>
        )}
        <label>
          Date d'union (facultatif) :
          <input
            type="date"
            name="DateofUnion"
            value={relationData.DateofUnion}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Date de séparation (facultatif) :
          <input
            type="date"
            name="DateofSeparation"
            value={relationData.DateofSeparation}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Créer Relation</button>
      </form>
    </div>
  );

  function handleInputChangeForMember(index, event) {
    const updatedMembers = [...relationData.MemberIds];
    updatedMembers[index] = event.target.value;
    setRelationData({
      ...relationData,
      MemberIds: updatedMembers,
    });
  }
}
