import React, { useState } from 'react';
import BillingHistory from '../components/UsageHistory/BillingHistory';
import FeatureUsage from '../components/UsageHistory/FeatureUsage';
import PlanHistory from '../components/UsageHistory/PlanHistory';
import NotificationsLog from '../components/UsageHistory/NotificationsLog';
import SendNotification from '../components/UsageHistory/SendNotification'; 
import PlanTrends from '../components/UsageHistory/PlanTrends'; // Import PlanTrends
import '../../src/assets/styles/UsageHistoryPage.css';

const UsageHistoryPage = () => {
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
      case 'PlanHistory':
        return <PlanHistory />;
      case 'FeatureUsage':
        return <FeatureUsage />;
      case 'NotificationsLog':
        return <NotificationsLog />;
      case 'BillingHistory':
        return <BillingHistory />;
      case 'SendNotification':  
        return <SendNotification />;
      case 'PlanTrends':  // Add the case for PlanTrends
        return <PlanTrends />;
      default:
        return null;
    }
  };

  return (
    <div className="usage-history-page p-6">
      <h1 className="text-3xl font-bold mb-6">Usage History</h1>

      {activeCard ? (
        <div className="section-content bg-white p-6 shadow rounded fade-in">
          {renderActiveSection()}
          <button 
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleBackClick}
          >
            Back to Usage History
          </button>
        </div>
      ) : (
        <div className="card-container grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card" onClick={() => handleCardClick('PlanHistory')}>
            <h2 className="text-xl font-semibold">Plan History</h2>
            <p>View past subscription plans.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('FeatureUsage')}>
            <h2 className="text-xl font-semibold">Feature Usage</h2>
            <p>See the features you've used.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('NotificationsLog')}>
            <h2 className="text-xl font-semibold">Notifications Log</h2>
            <p>Track your notification history.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('BillingHistory')}>
            <h2 className="text-xl font-semibold">Billing History</h2>
            <p>Review your billing history.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('SendNotification')}>
            <h2 className="text-xl font-semibold">Send Notification</h2>
            <p>Send a message to User/Recruiters.</p>
          </div>

          <div className="card" onClick={() => handleCardClick('PlanTrends')}> {/* Add the new card */}
            <h2 className="text-xl font-semibold">Plan Trends</h2>
            <p>View upgrade and downgrade trends.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageHistoryPage;
