import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./styles/Dashboard.css";

export default function Dashboard({ isLoggedIn }) {
  const [familyTree, setFamilyTree] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/getRelation'); // demander l'arbre généalogique
        setFamilyTree(response.data);
      } catch (error) {
        console.error('Error fetching family tree:', error);
      }
    };

    fetchData();
  }, []);

  // Si l'utilisateur n'est pas connecté, renvoyer à la page de connexion
  if (!isLoggedIn) {
    return (
      <div className="text-container">
        <h1 id="title">Vous devez être connecté pour accéder à cette page.</h1>
        <Link to="/login" id="start-button">Se connecter</Link>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }

  // Si l'utilisateur est connecté et que les données de l'arbre généalogique ont été chargées, affichez l'arbre généalogique
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {familyTree ? (
        <div>
          {/* Afficher l'arbre généalogique ici */}
        </div>
      ) : (
        <p>Chargement de l'arbre généalogique...</p>
      )}
    </div>
  );
};
