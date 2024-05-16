import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/SignupPage";
import Admin from "./pages/Admin";
import TreeTest from "./pages/Dashboard";

import "./App.css";
//import './pages/styles/background.css';

import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Configuration axios

  // const baseURL ="http://localhost:5000";  //ordinateur
  const baseURL = "https://192.168.56.1"; //telephone
  axios.defaults.baseURL = baseURL;
  axios.defaults.withCredentials = true; // Activer les cookies cross-origin
  console.log(axios.defaults.baseURL);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en consultant le localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = () => {
    setIsLoggedIn(true);
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      console.log("log out successfully");
    } catch (error) {
      console.error("Error:", error);
      console.log(
        error.response.data.error ||
          error.response.data.message ||
          "An error occurred"
      );
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} logout={logout} />
        <div className="page-content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<TreeTest />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
