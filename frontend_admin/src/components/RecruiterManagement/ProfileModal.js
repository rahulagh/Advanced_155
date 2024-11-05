// src/components/RecruiterManagement/ProfileModal.js
import React from 'react';
import '../../assets/styles/ProfileModal.css'; // Optional CSS for modal styling

const ProfileModal = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{profile.name}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;
