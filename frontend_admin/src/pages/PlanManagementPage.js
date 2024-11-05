import React, { useState } from 'react';
import ManagePlans from '../components/PlanManagement/ManagePlans';
import BulkAssign from '../components/PlanManagement/BulkAssign';
import AddRemoveFeatures from '../components/PlanManagement/AddRemoveFeatures';
import ExpiringPlans from '../components/PlanManagement/ExpiringPlans';
import RenewExtendPlans from '../components/PlanManagement/RenewExtendPlans';
import '../assets/styles/PlanManagementPage.css'; // Assume CSS for styling

const PlanManagementPage = () => {
  const [activeCard, setActiveCard] = useState(null); // State to track the active card

  // Function to handle card clicks
  const handleCardClick = (card) => {
    setActiveCard(card); // Set the active card when clicked
  };

  // Function to handle going back to the card view
  const handleBackClick = () => {
    setActiveCard(null); // Reset active card to show all cards
  };

  // Render the active component or show the cards
  const renderActiveSection = () => {
    switch (activeCard) {
      case 'ManagePlans':
        return <ManagePlans />;
      case 'BulkAssign':
        return <BulkAssign />;
      case 'AddRemoveFeatures':
        return <AddRemoveFeatures />;
      case 'ExpiringPlans':
        return <ExpiringPlans />;
      case 'RenewExtendPlans':
        return <RenewExtendPlans />;
      default:
        return null;
    }
  };

  return (
    <div className="plan-management-page p-6">
      <h1 className="text-3xl font-bold mb-6">Plan Management</h1>

      {activeCard ? (
        <div className="section-content bg-white p-6 shadow rounded fade-in">
          {renderActiveSection()}
          <button 
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleBackClick}
          >
            Back to Plan Management
          </button>
        </div>
      ) : (
        <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card" onClick={() => handleCardClick('ManagePlans')}>
            <h2 className="text-xl font-semibold">Manage Plans</h2>
            <p>Manage and configure all plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('BulkAssign')}>
            <h2 className="text-xl font-semibold">Bulk Assign</h2>
            <p>Bulk assign plans to multiple recruiters.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('AddRemoveFeatures')}>
            <h2 className="text-xl font-semibold">Add/Remove Features</h2>
            <p>Add or remove features from plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('ExpiringPlans')}>
            <h2 className="text-xl font-semibold">Expiring Plans</h2>
            <p>View and manage expiring plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('RenewExtendPlans')}>
            <h2 className="text-xl font-semibold">Renew/Extend Plans</h2>
            <p>Renew or extend recruiter plans.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagementPage;
