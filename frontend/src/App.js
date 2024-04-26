import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateTreePage from './pages/CreateTreePage';
import CreateRelationPage from './pages/CreateRelationPage';
import Login from './pages/LoginPage'; 
import Register from './pages/SignupPage'; 
import Admin from './pages/Admin'; 
import Dashboard from './pages/Dashboard'; 

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en consultant le localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = () => {
    setIsLoggedIn(true);
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} logout={logout} />
        <div className="page-content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/create-tree" element={<CreateTreePage />} />
            <Route path="/create-relation" element={<CreateRelationPage />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
