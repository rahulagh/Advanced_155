import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { fetchUsers, updateFeatureQuotas } from '../../services/api';

// Card Component
const Card = ({ children, className }) => (
  <div className={`w-full max-w-7xl mx-auto p-6 shadow-md border rounded-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-2xl font-semibold text-gray-800">{children}</h2>;
const CardContent = ({ children }) => <div>{children}</div>;

const Alert = ({ variant, children }) => (
  <div className={`alert ${variant === 'destructive' ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500'} border-t-4 p-3 mt-4 rounded-md`}>
    <div className="flex items-center space-x-2">
      <Check className={`w-5 h-5 ${variant === 'destructive' ? 'text-red-500' : 'text-green-500'}`} />
      <span className="text-xs font-semibold">{children}</span>
    </div>
  </div>
);

const UpdatePlan = () => {
  const [users, setUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchAllUsers();
  }, []);

  const handleQuotaChange = (userId, quotaType, value) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, [quotaType]: value }
        : user
    ));
  };

  const saveQuotas = async (userId) => {
    const user = users.find(user => user.id === userId);
    const { jobPosts, videoInterviewSlots, candidateSearchLimit } = user;

    try {
      await updateFeatureQuotas(userId, { jobPosts, videoInterviewSlots, candidateSearchLimit });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating quotas:", error);
    }
  };

  return (
    <div className="p-8 flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Plan and Quota Management</CardTitle>
          <p className="text-sm text-gray-600">Modify feature quotas for users and recruiters.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Name</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Email</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Job Posts</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Video Slots</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Search Limit</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-700">Save</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-2 py-2">{user.name}</td>
                    <td className="px-2 py-2">{user.email}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={user.jobPosts || 0}
                        onChange={(e) => handleQuotaChange(user.id, 'jobPosts', parseInt(e.target.value))}
                        min="0"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={user.videoInterviewSlots || 0}
                        onChange={(e) => handleQuotaChange(user.id, 'videoInterviewSlots', parseInt(e.target.value))}
                        min="0"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={user.candidateSearchLimit || 0}
                        onChange={(e) => handleQuotaChange(user.id, 'candidateSearchLimit', parseInt(e.target.value))}
                        min="0"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button 
                        onClick={() => saveQuotas(user.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <Alert variant="success">
          Success: Quotas updated successfully.
        </Alert>
      )}
    </div>
  );
};

export default UpdatePlan;
