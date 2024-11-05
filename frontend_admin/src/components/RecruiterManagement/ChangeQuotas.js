// src/components/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import { createUser, updateUserQuotas, getAllUsers } from '../../services/api'; // Adjust the import based on your structure

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        type: 'recruiter',
        plan: '',
        company: '',
        phone: '',
        planExpiration: '',
        quotas: {
            jobPosts: { total: 0, used: 0 },
            candidateSearches: { total: 0, used: 0 },
            bulkMessages: { total: 0, used: 0 },
            videoInterviews: { total: 0, used: 0 },
        },
    });

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getAllUsers();
            setUsers(result.data);
        };
        fetchUsers();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Handle user creation
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createUser(userData);
        if (response.status === 201) {
            setUsers([...users, response.data.user]);
            setUserData({ name: '', email: '', password: '', type: 'recruiter', plan: '', company: '', phone: '', planExpiration: '', quotas: { jobPosts: { total: 0, used: 0 }, candidateSearches: { total: 0, used: 0 }, bulkMessages: { total: 0, used: 0 }, videoInterviews: { total: 0, used: 0 } } });
        }
    };

    // Handle quotas update
    const handleQuotaUpdate = async (userId) => {
        const updatedQuotas = {
            jobPosts: { total: 5, used: 2 }, // Example update
            candidateSearches: { total: 10, used: 3 },
            bulkMessages: { total: 8, used: 4 },
            videoInterviews: { total: 6, used: 1 },
        };
        const response = await updateUserQuotas(userId, updatedQuotas);
        if (response.status === 200) {
            // Optionally refresh user list
            const updatedUsers = users.map(user => (user._id === userId ? { ...user, quotas: updatedQuotas } : user));
            setUsers(updatedUsers);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={userData.name} onChange={handleChange} placeholder="Name" required />
                <input name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
                <input name="password" value={userData.password} onChange={handleChange} placeholder="Password" required type="password" />
                <input name="type" value={userData.type} onChange={handleChange} placeholder="Type" />
                <input name="plan" value={userData.plan} onChange={handleChange} placeholder="Plan" />
                <input name="company" value={userData.company} onChange={handleChange} placeholder="Company" />
                <input name="phone" value={userData.phone} onChange={handleChange} placeholder="Phone" />
                <input name="planExpiration" value={userData.planExpiration} onChange={handleChange} placeholder="Plan Expiration" />
                <button type="submit">Create User</button>
            </form>

            <h3>Users List</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleQuotaUpdate(user._id)}>Update Quotas</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
