// src/components/RecruiterManagement/ProfileList.js
import React, { useEffect, useState } from 'react';
import { fetchUserProfiles } from '../../services/api';
//import ProfileDetails from './ProfileDetails';
import ProfileModal from './ProfileModal';
import '../../assets/styles/ProfileList.css'; // Add your CSS import

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetchUserProfiles();
        setProfiles(response);
      } catch (err) {
        setError('Error fetching profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (profileId) => {
    const profile = profiles.find((p) => p._id === profileId);
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null); // Close the modal by resetting selected profile
  };

  if (loading) return <div>Loading profiles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-list-container">
      <div className="profile-list">
        <h2>User Profiles</h2>
        <ul>
          {profiles.map((profile) => (
            <li key={profile._id}>
              <div>
                <strong>{profile.name}</strong>
                <p>{profile.email}</p>
              </div>
              <button onClick={() => handleProfileClick(profile._id)}>View</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedProfile && (
        <ProfileModal profile={selectedProfile} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfileList;
