import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/Dashboard.css";

export default function Dashboard({ isLoggedIn }) {
  // Si l'utilisateur n'est pas connecté, renvoyer à la page de connexion
  if (!isLoggedIn) {
    return (
      <div className="text-container">
        <h1 id="title">You need to log in to access the dashboard.</h1>
        <Link to="/login" id="start-button">Log in</Link>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher le tableau de bord
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};