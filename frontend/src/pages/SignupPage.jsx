import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./styles/LoginPage.css";

export default function Signup() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [sexe, setSexe] = useState('');
    const [photo, setPhoto] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [dateDeces, setDateDeces] = useState('');
    const [professions, setProfessions] = useState('');
    const [adresse, setAdresse] = useState('');
    const [tel, setTel] = useState('');
    const [error, setError] = useState('');

    const handleFirstStepSubmit = async (event) => {
        event.preventDefault();
        try {
            if (password1 === password2) {
                if (password1.length >= 6 && /[a-zA-Z]/.test(password1) && /[0-9]/.test(password1)) {
                    setStep(2);
                } else {
                    setError("Password must contain at least 6 characters (letters and numbers).");
                }
            } else {
                setError("The passwords are not the same.");
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response.data.error || error.response.data.message || 'An error occurred');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/auth/register', { email, password: password1, nom, prenom, sexe, photo, dateNaissance, dateDeces, professions, adresse, tel});
            window.location.href = '/login';
        } catch (error) {
            console.error('Error:', error);
            setError(error.response.data.error || error.response.data.message || 'An error occurred');
            setStep(1);
        }
    };

    return (
        <div>
            {step === 1 && (
                <div className="login-container">
                    <h2>Sign up</h2>
                    <form onSubmit={handleFirstStepSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" placeholder="example@gmail.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password1" placeholder="Password.123" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                        <label htmlFor="password">Verify the password:</label>
                        <input type="password" id="password2" placeholder="Password.123" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                        <button type="submit">Next</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    <p>Have you an account? <Link to="/login">Log in</Link></p>
                </div>
            )}

            {step === 2 && (
                <div className="login-container">
                    <h2>Sign up</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nom">Lastname*:</label>
                        <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                        <label htmlFor="prenom">Firstname*:</label>
                        <input type="text" id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                        <label htmlFor="sexe">Gender*:</label>
                        <select id="sexe" value={sexe} onChange={(e) => setSexe(e.target.value)} required>
                            <option value="Homme">Male</option>
                            <option value="Femme">Female</option>
                        </select>
                        <label htmlFor="photo">Picture:</label>
                        <input type="file" id="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                        <label htmlFor="dateNaissance">Date of birth:</label>
                        <input type="date" id="dateNaissance" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} />
                        <label htmlFor="dateDeces">Date of death:</label>
                        <input type="date" id="dateDeces" value={dateDeces} onChange={(e) => setDateDeces(e.target.value)} />
                        <label htmlFor="professions">Job:</label>
                        <input type="text" id="professions" value={professions} onChange={(e) => setProfessions(e.target.value)} />
                        <label htmlFor="adresse">Adress:</label>
                        <input type="text" id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                        <label htmlFor="tel">Telephone number:</label>
                        <input type="tel" id="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
                        <button type="submit">Sign Up</button>
                    </form>
                    <p>(*): This filed is required.</p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
        </div>
    );
}
