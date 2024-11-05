// src/components/ManualRenewal.js
import React, { useState, useEffect } from 'react';
import { fetchUsers, renewPlan } from '../../services/api';

const ManualRenewal = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const userData = await fetchUsers();
      setUsers(userData);
    };
    loadUsers();
  }, []);

  const handleRenew = async () => {
    if (!selectedUserId || !newExpiryDate) {
      alert('Please select a user and enter a new expiration date.');
      return;
    }

    try {
      const response = await renewPlan(selectedUserId, newExpiryDate);
      alert(`Plan renewed successfully for ${response.name}. New expiry date: ${newExpiryDate}`);
      // Optionally refresh users or update state to reflect changes
      setNewExpiryDate(''); // Clear the date input
    } catch (error) {
      alert('Error renewing plan: ' + error.message);
    }
  };

  return (
    <div className="manual-renewal">
      <h2>Manual Plan Renewal</h2>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1"
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <input
        type="date"
        value={newExpiryDate}
        onChange={(e) => setNewExpiryDate(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1"
      />
      <button onClick={handleRenew} className="btn-primary">
        Renew Plan
      </button>
    </div>
  );
};

export default ManualRenewal;
