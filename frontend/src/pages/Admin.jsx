import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users'); //route pour récupérer la liste de tous les utilsateurs
                setUsers(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await axios.put(`/users/${userId}/role`, { role: newRole }); // attribuer un nouveau rôle
            const updatedUser = response.data;
            // Mettre à jour la liste des utilisateurs avec le nouvel utilisateur mis à jour
            setUsers(prevUsers => prevUsers.map(user => (user._id === updatedUser._id ? updatedUser : user)));
        } catch (error) {
            console.error('Error updating user role:', error);
            setError('Error updating user role. Please try again later.');
        }
    };

    const updateUserValidation = async (userId, validated) => {
        try {
            const response = await axios.put(`/users/${userId}/validation`, { validated }); //valider l'inscription
            const updatedUser = response.data;
            // Mettre à jour la liste des utilisateurs avec le nouvel utilisateur mis à jour
            setUsers(prevUsers => prevUsers.map(user => (user._id === updatedUser._id ? updatedUser : user)));
        } catch (error) {
            console.error('Error updating user validation:', error);
            setError('Error updating user validation. Please try again later.');
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}/delete`); //supprimer un utilisateur
            // Mettre à jour la liste des utilisateurs en supprimant l'utilisateur supprimé
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please try again later.');
        }
    };

    return (
        <div>
            <h1>List of Users</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <p>Validated: {user.validated ? 'Yes' : 'No'}</p>
                            <button onClick={() => updateUserRole(user._id, user.role === 'user' ? 'admin' : 'user')}>
                                {user.role === 'user' ? 'Promote to admin' : 'Remove admin rights'}
                            </button>
                            <button onClick={() => updateUserValidation(user._id, !user.validated)}>
                                {user.validated ? 'Revoke Validation' : 'Validate'}
                            </button>
                            <button onClick={() => deleteUser(user._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
