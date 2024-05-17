import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/LoginPage.css";
import "./styles/background.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(" ");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      console.log("envoie demande");
      if (response.status === 200) {
        // Connexion réussie
        const { token, personId, role } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("personId", personId);
        localStorage.setItem("role", role);

        onLogin();
        navigate("/dashboard");
      } else {
        setError("Identifiants incorrects");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data.error ||
          error.response?.data.message ||
          "Une erreur s'est produite"
      );
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            placeholder="Password.123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p>
          Vous n'avez pas encore de compte ?{" "}
          <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
