// import React, { useState } from 'react';
// import { sendNotification, sendBulkNotifications } from '../../services/api'; // Import API methods

// const SendNotification = () => {
//   const [userId, setUserId] = useState('');  // For single user notification
//   const [userIds, setUserIds] = useState(''); // For bulk notification (comma-separated)
//   const [message, setMessage] = useState('');
//   const [type, setType] = useState('email');  // Default to 'email'
//   const [isBulk, setIsBulk] = useState(false); // Toggle between single and bulk
//   const [response, setResponse] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isBulk) {
//         // Split userIds by comma for bulk notifications
//         const userIdsArray = userIds.split(',').map((id) => id.trim());
//         const res = await sendBulkNotifications(userIdsArray, message, type);
//         setResponse(res.message);
//       } else {
//         const res = await sendNotification(userId, message, type);
//         setResponse(res.message);
//       }
//     } catch (err) {
//       setResponse('Error sending notification');
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-bold">Notification Type</label>
//           <div className="flex items-center mb-2">
//             <label className="mr-4">
//               <input
//                 type="radio"
//                 checked={!isBulk}
//                 onChange={() => setIsBulk(false)}
//                 className="mr-2"
//               />
//               Single User
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 checked={isBulk}
//                 onChange={() => setIsBulk(true)}
//                 className="mr-2"
//               />
//               Bulk Users
//             </label>
//           </div>
//         </div>

//         {/* Input for single or bulk */}
//         {!isBulk ? (
//           <div className="mb-4">
//             <label className="block text-sm font-bold">User ID</label>
//             <input
//               type="text"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               className="border rounded w-full py-2 px-3"
//               required
//             />
//           </div>
//         ) : (
//           <div className="mb-4">
//             <label className="block text-sm font-bold">User IDs (comma-separated)</label>
//             <input
//               type="text"
//               value={userIds}
//               onChange={(e) => setUserIds(e.target.value)}
//               className="border rounded w-full py-2 px-3"
//               required
//             />
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block text-sm font-bold">Message</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="border rounded w-full py-2 px-3"
//             required
//           ></textarea>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-bold">Type</label>
//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             className="border rounded w-full py-2 px-3"
//           >
//             <option value="email">Email</option>
//             <option value="sms">SMS</option>
//           </select>
//         </div>

//         <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
//           Send Notification
//         </button>
//       </form>

//       {response && <p className="mt-4">{response}</p>}
//     </div>
//   );
// };

// export default SendNotification;
