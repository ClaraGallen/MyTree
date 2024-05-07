import React from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom si vous utilisez React Router
import './styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <h1 className="logo">My Tree</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">Log in</Link>
        </li>
        <li>
          <Link to="/register" className="nav-link">Sign up</Link>
        </li>
        <li>
          <Link to="/admin" className="nav-link">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};
