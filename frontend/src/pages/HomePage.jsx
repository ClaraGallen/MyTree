import React from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import "./styles/HomePage.css";


export default function HomePage() {
    return (
        <div className="text-container">
            <h1 id="title">Explore Your Family Roots</h1>
            <p id="subtitle">Uncover the fascinating history of your family through the generations with
             Genealogy Tree. Our user-friendly platform allows you to create interactive family trees, 
             trace family connections, and discover untold stories about your ancestors.</p>
            <Link to="/register" id="start-button">Start Now</Link>
        </div>
    );
};
