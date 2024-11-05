// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/api'; // Make sure this matches the correct function name

const UserProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await fetchUserProfile(userId); // Use the correct function name
        setProfileData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <h3>Account Information</h3>
      <p><strong>Name:</strong> {profileData.name}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>Company:</strong> {profileData.company}</p>
      <p><strong>Contact Number:</strong> {profileData.contactNumber}</p>
      
      <h3>Plan Status</h3>
      <p><strong>Status:</strong> {profileData.planStatus}</p>
      <p><strong>Expiration Date:</strong> {new Date(profileData.expirationDate).toLocaleDateString()}</p>
      
      <h3>Remaining Quotas</h3>
      <ul>
        <li><strong>Job Posts:</strong> {profileData.remainingQuotas.jobPosts}</li>
        <li><strong>Bulk Messages:</strong> {profileData.remainingQuotas.bulkMessages}</li>
        <li><strong>Candidate Searches:</strong> {profileData.remainingQuotas.candidateSearches}</li>
      </ul>

      <h3>Feature Usage</h3>
      <p><strong>Video Interviews Conducted:</strong> {profileData.featureUsage.videoInterviews} / {profileData.allocated.videoInterviews}</p>
    </div>
  );
};

export default UserProfile;
