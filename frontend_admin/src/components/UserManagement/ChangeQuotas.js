// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';

// const ChangeQuotas = () => {
//   const { id } = useParams();
//   const [quota, setQuota] = useState('');

//   const handleQuotaChange = () => {
//     // API call to update the quota for the user
//     alert(`Quota updated for user ${id}.`);
//   };

//   return (
//     <div>
//       <h1>Change Quotas for User {id}</h1>
//       <input
//         type="number"
//         value={quota}
//         onChange={(e) => setQuota(e.target.value)}
//         placeholder="Enter new quota"
//       />
//       <button onClick={handleQuotaChange}>Submit</button>
//     </div>
//   );
// };

// export default ChangeQuotas;


import React, { useState } from 'react';

const ChangeQuotas = ({ user }) => {
  const [quota, setQuota] = useState(100); // Example default quota

  const handleChange = () => {
    // Logic to change quota
    alert(`Quota updated to ${quota}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Change Quotas for {user.name}</h2>
      <input
        type="number"
        value={quota}
        onChange={(e) => setQuota(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleChange} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Change Quota
      </button>
    </div>
  );
};

export default ChangeQuotas;
