import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importer Axios
import "./styles/LoginPage.css";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(' ');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (password1 === password2){
                const password = password1;
                const response = await axios.post('/auth/register', { email, password });
                if (response.status === 200) {
                    window.location.href = '/dashboard';
                } else {
                    setError("Email address already in use, please choose another one.");
                }
            } else {
                setError("The passwords are not the same.");
            }
            
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred');
        }
    };

    return (
        <div>
            <div className="login-container">
                <h2>Sign up</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" placeholder="example@gmail.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password1" placeholder="Password.123" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                    <label htmlFor="password">Verify the password:</label>
                    <input type="password" id="password2" placeholder="Password.123" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                    <button type="submit">Sign up</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p>Have you an account? <Link to="/login">Log in</Link></p>

            </div>
        </div>
    );
};
