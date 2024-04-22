import React, { useState } from 'react';
import axios from '../axiosConfig';
import './styles/CreateTreePage.css';

export default function CreateParentPage() {
  // États pour les données du formulaire
  const [newParent, setNewParent] = useState({
    ParentId: '',
    FamilyName: '',
    FirstName: '',
    Genre: '',
    Picture: '',
    DateofBirth: '',
    DateofDeath: '',
    Profession: '',
    Contacts: [],
    Info: '',
  });

  // État pour le message d'erreur
  const [errorMessage, setErrorMessage] = useState('');

// Fonction pour mettre à jour les données du formulaire lors de la saisie de l'utilisateur
const handleInputChange = (event) => {
  const { name, value, type, checked } = event.target;
  // Si le type est "radio", mettez à jour la valeur uniquement si la case est cochée
  const newValue = type === 'radio' ? (checked ? value : '') : value;
  setNewParent({
    ...newParent,
    [name]: newValue,
  });
};


  // Fonction pour soumettre le formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Vérifier si tous les champs sont remplis
    const formFields = Object.values(newParent);
    console.log(formFields);
    if (!newParent.ParentId || !newParent.FamilyName || !newParent.FirstName || !newParent.Genre) {
      setErrorMessage('Please complete all fields markes with *.');
      return;
    }
    try {
      // Envoyer les données du formulaire au backend pour créer un nouvel enregistrement de parent
      await axios.post('/tree/parents', newParent);
      // Réinitialiser les champs du formulaire après la soumission réussie
      setNewParent({
        ParentId: '',
        FamilyName: '',
        FirstName: '',
        Genre: 'Male',
        Picture: '',
        DateofBirth: '',
        DateofDeath: '',
        Profession: '',
        Contacts: [],
        Info: '',
      });
      // Effacer le message d'erreur s'il existe
      setErrorMessage('New parent created successfully!');
    } catch (error) {
      console.error('Error creating parent:', error);
      setErrorMessage('Error creating parent.')
    }
  };

  return (
    <div className='text-container'>
      <h1>Create new member</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        {/* Champs du formulaire */}
        <label className="form-label">
          <input className="form-input" type="text" placeholder="ParentId*" name="ParentId" value={newParent.ParentId} onChange={handleInputChange} />
        </label>
        <label className="form-label">
          <input className="form-input" type="text" placeholder="Last Name*" name="FamilyName" value={newParent.FamilyName} onChange={handleInputChange} />
        </label>
        <label className="form-label">
          <input className="form-input" type="text" placeholder="First Name*" name="FirstName" value={newParent.FirstName} onChange={handleInputChange} />
        </label>
        <label className="form-label">
          Gender* :
          <div className="gender-radio">
            <label>
              <input type="radio" name="Genre" value="Homme" onChange={handleInputChange} />
              Male 
            </label>
            <label>
              <input type="radio" name="Genre" value="Femme" onChange={handleInputChange} />
              Female
            </label>
          </div>
        </label>
        {/* Afficher le message d'erreur */}
        {errorMessage && <p style={{ color: 'gray' }}>{errorMessage}</p>}
        {/* Ajoutez d'autres champs de formulaire si nécessaire */}
        <button className="form-submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
}
