import React from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import "./styles/HomePage.css";


export default function HomePage() {
    return (
        <div className="text-container">
            <h1 id="title">Create your family tree</h1>
            <p id="subtitle">Your story will begin...</p>
            <Link to="/create-tree" id="start-button">Start Now</Link>
        </div>
    );
};
