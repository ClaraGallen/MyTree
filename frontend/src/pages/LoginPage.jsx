import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./styles/LoginPage.css";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(' ');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password }); //route pour envoyer la demande de connexion
            if (response.status === 200) {
                // Connexion réussie, récupérer le token et rediriger l'utilisateur
                const token = response.data.token;
                localStorage.setItem('token', token); // Stocker le token dans le localStorage
                onLogin();
                window.location.href = '/dashboard';
            } else {
                setError('Identifiants incorrects');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Une erreur s\'est produite');
        }
    };

    return (
        <div>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" placeholder="example@gmail.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Password.123" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
        </div>
    );
};
