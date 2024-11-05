// import React, { useState } from 'react';

// const NotificationsSettings = () => {
//   const [emailNotifications, setEmailNotifications] = useState(false);
//   const [smsNotifications, setSmsNotifications] = useState(false);

//   const handleToggleEmail = () => {
//     setEmailNotifications(prevState => !prevState);
//     // Call API to update email notification settings
//   };

//   const handleToggleSMS = () => {
//     setSmsNotifications(prevState => !prevState);
//     // Call API to update SMS notification settings
//   };

//   return (
//     <div className="p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold">Notification Settings</h2>
//       <label className="flex items-center">
//         <input 
//           type="checkbox" 
//           checked={emailNotifications} 
//           onChange={handleToggleEmail} 
//           className="mr-2" 
//         />
//         Enable Email Notifications
//       </label>
//       <label className="flex items-center mt-2">
//         <input 
//           type="checkbox" 
//           checked={smsNotifications} 
//           onChange={handleToggleSMS} 
//           className="mr-2" 
//         />
//         Enable SMS Notifications
//       </label>
//     </div>
//   );
// };

// export default NotificationsSettings;


import React, { useState } from 'react';

const NotificationsSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleEmailChange = () => {
    setEmailNotifications(prev => !prev);
  };

  const handleSmsChange = () => {
    setSmsNotifications(prev => !prev);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={handleEmailChange}
            className="mr-2"
          />
          Email Notifications
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={handleSmsChange}
            className="mr-2"
          />
          SMS Notifications
        </label>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </div>
  );
};

export default NotificationsSettings;
