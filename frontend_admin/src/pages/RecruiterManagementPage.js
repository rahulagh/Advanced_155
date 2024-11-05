import React, { useState } from 'react';
import RecruiterList from '../components/RecruiterManagement/RecruiterList';
import ProfileList from '../components/RecruiterManagement/ProfileList'; // Import ProfileList
import UpdatePlans from '../components/RecruiterManagement/UpdatePlans';
import ChangeQuotas from '../components/RecruiterManagement/ChangeQuotas';
import DeactivateAccount from '../components/RecruiterManagement/DeactivateAccount';
import ReactivateAccount from '../components/RecruiterManagement/ReactivateAccount';
import ProfileDetails from '../components/RecruiterManagement/ProfileDetails'; // Import ProfileDetails
import '../assets/styles/RecruiterManagementPage.css'; // Include CSS for styling

const RecruiterManagementPage = () => {
  const [activeSection, setActiveSection] = useState('RecruiterList'); // Manage the active section
  const [showCards, setShowCards] = useState(true); // State to manage visibility of cards
  const [selectedProfile, setSelectedProfile] = useState(null); // State to hold the selected profile

  // Function to handle card clicks
  const handleCardClick = (section) => {
    setActiveSection(section);
    setShowCards(false); // Hide cards when a section is clicked
  };

  // Function to go back to cards
  const handleBackClick = () => {
    setShowCards(true); // Show cards again
    setSelectedProfile(null); // Clear selected profile when going back
  };

  // Render the component dynamically based on the activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'RecruiterList':
        return <RecruiterList />;
      case 'ProfileList':
        return <ProfileList setSelectedProfile={setSelectedProfile} />; // Pass function to ProfileList
      case 'UpdatePlans':
        return <UpdatePlans />;
      case 'ChangeQuotas':
        return <ChangeQuotas />;
      case 'DeactivateAccount':
        return <DeactivateAccount />;
      case 'ReactivateAccount':
        return <ReactivateAccount />;
      default:
        return <RecruiterList />;
    }
  };

  return (
    <div className="recruiter-management-page p-6">
      <h1 className="text-3xl font-bold mb-6">Recruiter Management</h1>

      {/* Show cards or dynamic section content based on showCards state */}
      {showCards ? (
        <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card" onClick={() => handleCardClick('RecruiterList')}>
            <h2 className="text-xl font-semibold">Recruiter List</h2>
            <p>View and manage all recruiters.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('UpdatePlans')}>
            <h2 className="text-xl font-semibold">Update Plans</h2>
            <p>Update recruiter subscription plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ProfileList')}>
            <h2 className="text-xl font-semibold">Profile List</h2>
            <p>View and edit recruiter profiles.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ChangeQuotas')}>
            <h2 className="text-xl font-semibold">Change Quotas</h2>
            <p>Adjust recruiter quotas.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('DeactivateAccount')}>
            <h2 className="text-xl font-semibold">Deactivate Account</h2>
            <p>Temporarily deactivate recruiter accounts.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ReactivateAccount')}>
            <h2 className="text-xl font-semibold">Reactivate Account</h2>
            <p>Reactivate deactivated recruiter accounts.</p>
          </div>
        </div>
      ) : (
        <div className="section-content bg-white p-6 shadow rounded fade-in">
          {renderSection()}
          {/* Render ProfileDetails when a profile is selected */}
          {selectedProfile && <ProfileDetails profile={selectedProfile} />}
          {/* Button to go back to cards */}
          <button 
            className="mt-4 p-2 bg-blue-500 text-white rounded transition hover:bg-blue-700"
            onClick={handleBackClick}
          >
            Back to Recruiter Management
          </button>
        </div>
      )}
    </div>
  );
};

export default RecruiterManagementPage;
