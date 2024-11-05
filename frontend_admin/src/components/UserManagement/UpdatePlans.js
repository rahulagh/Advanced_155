import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserPlan } from '../../services/api';

const UpdatePlans = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchUserProfile(id);
                setUser(data.user);
                setSelectedPlan(data.user.plan.name);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const planData = { name: selectedPlan }; // Pass planData with more properties if needed
            await updateUserPlan(id, planData);
            setSuccessMessage(`Your plan has been updated to ${selectedPlan}.`);
            setError(null);
            setTimeout(() => {
                setSuccessMessage('');
                navigate(`/user/${id}`); // Redirect to user profile after update
            }, 3000);
        } catch (err) {
            setError('Failed to update the plan. Please try again.'); // More user-friendly error
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Update Plan for {user.name}</h2>
            <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="border p-2 rounded">
                <option value="">Select Plan</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
            </select>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Update Plan
            </button>
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </div>
    );
};

export default UpdatePlans;
