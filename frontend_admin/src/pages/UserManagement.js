import React, { useState, useEffect } from 'react';
import ProfileDetails from '../components/UserManagement/ProfileDetails';
import UpdatePlans from '../components/UserManagement/UpdatePlans';
import ChangeQuotas from '../components/UserManagement/ChangeQuotas';
import DeactivateAccount from '../components/UserManagement/DeactivateAccount';
import ReactivateAccount from '../components/UserManagement/ReactivateAccount';
import '../../src/assets/styles/UserManagementPage.css'; // Custom CSS

import styled from "styled-components";
import UserList from "../components/ManageUsers/UserList";


import api from  "../services/api";

const Container = styled.div`
  padding: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-top:15px;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
`;

const UserManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null); // Track the selected card content
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected user ID
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      console.log(data)
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await api.updateUser(id, userData);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user. Please try again.");
    }
  };

  const handleApproveCertification = async (id) => {
    try {
      await api.approveCertification(id);
      fetchUsers();
    } catch (err) {
      setError("Failed to approve certification. Please try again.");
    }
  };

  const handleRejectCertification = async (id, reason) => {
    try {
      await api.rejectCertification(id, reason);
      fetchUsers();
    } catch (err) {
      setError("Failed to reject certification. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container>
       <div className="loading">Loading...</div>;
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Error: {error}</Title>
      </Container>
    );
  }

  // Function to handle card clicks and display content
  const handleCardClick = (card, userId = null) => {
    setSelectedCard(card); // Set the selected card
    if (userId) setSelectedUserId(userId); // Set the user ID if provided
  };

  // Function to render the active component based on selectedCard
  const renderActiveSection = () => {
    switch (selectedCard) {
      case 'ProfileDetails':
        return <ProfileDetails />;
      case 'UpdatePlans':
        return <UpdatePlans userId={selectedUserId} />; // Pass userId
      case 'ChangeQuotas':
        return <ChangeQuotas />;
      case 'DeactivateAccount':
        return <DeactivateAccount />;
      case 'ReactivateAccount':
        return <ReactivateAccount />;
      default:
        return null;
    }
  };

  return (
    <div className="user-management-page p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {selectedCard ? (
        <div className="section-content bg-white p-6 shadow rounded fade-in">
          {renderActiveSection()}
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              setSelectedCard(null); // Reset the selected card to null to show all cards
              setSelectedUserId(null); // Reset selected user ID
            }}
          >
            Back to User Management
          </button>
        </div>
      ) : (
        <div className="card-container grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card" onClick={() => handleCardClick('ProfileDetails')}>
            <h2 className="text-xl font-semibold">Profile Details</h2>
            <p>View and edit user profile details.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('UpdatePlans', 'user-id-here')}> {/* Use actual user ID */}
            <h2 className="text-xl font-semibold">Update Plans</h2>
            <p>Manage user subscription plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ChangeQuotas')}>
            <h2 className="text-xl font-semibold">Change Quotas</h2>
            <p>Update user quotas for various services.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('DeactivateAccount')}>
            <h2 className="text-xl font-semibold">Deactivate Account</h2>
            <p>Deactivate a user account.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ReactivateAccount')}>
            <h2 className="text-xl font-semibold">Reactivate Account</h2>
            <p>Reactivate a user account.</p>
          </div>
        </div>
      )}

      <div>
          <Container>
          {/* <h2>Users Management</h2> */}
          <UserList
            users={users}
            onUpdateUser={handleUpdateUser}
            onApproveCertification={handleApproveCertification}
            onRejectCertification={handleRejectCertification}
          />
        </Container>
      </div>

    </div>
  );
};

export default UserManagement;
