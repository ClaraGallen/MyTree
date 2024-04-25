// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateTreePage from './pages/CreateTreePage';
import CreateRelationPage from './pages/CreateRelationPage';
import Login from './pages/LoginPage'; 
import Register from './pages/SignupPage'; 

import './App.css'; // Importer le fichier CSS pour appliquer les styles

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Ajouter une classe pour le conteneur principal */}
        <Navbar />
        <div className="page-content"> {/* Ajouter une classe pour le contenu de la page */}
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/create-tree" element={<CreateTreePage />} />
            <Route path="/create-relation" element={<CreateRelationPage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
