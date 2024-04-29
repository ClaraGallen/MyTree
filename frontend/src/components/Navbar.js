// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = ({ isLoggedIn, logout }) => {
  return (
    <div className="navContainer">
      <nav className="navbar">
        <div className="logo-container">
          <h1 className="logo">My Tree</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Accueil</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/dashboard/account" className="nav-link">Mon profil</Link>
              </li>
              <li>
                <Link to="/dashboard/tree" className="nav-link">Arbre</Link>
              </li>
              <li>
                <Link to="/" onClick={logout} className="nav-link">Déconnection</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">Connection</Link>
              </li>
              <li>
                <Link to="/register" className="nav-link">Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
