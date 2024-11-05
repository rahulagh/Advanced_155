// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const UserList = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     // Dummy data. Replace with API call
//     const userData = [
//       { id: 1, name: 'John Doe', plan: 'Premium' },
//       { id: 2, name: 'Jane Smith', plan: 'VIP' },
//     ];
//     setUsers(userData);
//   };

//   return (
//     <div>
//       <h1>User List</h1>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>
//             <Link to={`/user/${user.id}`}>{user.name}</Link> - {user.plan}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserList;


import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    // For demo, using dummy data
    const fetchedUsers = [
      //{ id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium' },
      //{ id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Basic' },
      // Add more dummy users
    ];
    setUsers(fetchedUsers);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200">ID</th>
            <th className="border border-gray-200">Name</th>
            <th className="border border-gray-200">Email</th>
            <th className="border border-gray-200">Plan</th>
            <th className="border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-200">{user.id}</td>
              <td className="border border-gray-200">{user.name}</td>
              <td className="border border-gray-200">{user.email}</td>
              <td className="border border-gray-200">{user.plan}</td>
              <td className="border border-gray-200">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500">Deactivate</button>
                <button className="text-green-500">Reactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
