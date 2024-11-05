import React, { useState, useEffect } from 'react';
import { Check, Users } from 'lucide-react';
import { fetchUsers, assignChangePlan, bulkAssignPlans } from '../../services/api';

const Card = ({ children }) => (
  <div className="border rounded-lg p-4 shadow-md">
    {children}
  </div>
);

const CardHeader = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded">
    {children}
  </select>
);

const Button = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded ${disabled ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
  >
    {children}
  </button>
);

const Alert = ({ children }) => (
  <div className="p-4 border border-green-200 bg-green-50 rounded">
    {children}
  </div>
);

const PlanManagement = () => {
  const [users, setUsers] = useState([]);
  const [plans] = useState(['Basic', 'Premium', 'VIP']);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkPlan, setBulkPlan] = useState('');
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

  const handlePlanChange = async (userId, newPlan) => {
    try {
      await assignChangePlan(userId, newPlan);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, currentPlan: newPlan } : user
      ));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkPlan || selectedUsers.length === 0) return;

    try {
      await bulkAssignPlans(selectedUsers, bulkPlan);
      setUsers(users.map(user => 
        selectedUsers.includes(user.id)
          ? { ...user, currentPlan: bulkPlan }
          : user
      ));
      setSelectedUsers([]);
      setBulkPlan('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error bulk updating plans:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Plan Management"
          description="Assign or update plans for users and recruiters"
        />
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-4 mb-4">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Bulk Plan Update</h3>
          </div>
          <div className="flex gap-4">
            <Select value={bulkPlan} onChange={setBulkPlan}>
              <option value="" disabled>Select plan...</option>
              {plans.map(plan => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </Select>
            <Button
              onClick={handleBulkUpdate}
              disabled={!bulkPlan || selectedUsers.length === 0}
            >
              Update Selected Users
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium border-b">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedUsers.length === users.length && users.length > 0}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-4 text-left font-medium border-b">Name</th>
                <th className="p-4 text-left font-medium border-b">Email</th>
                <th className="p-4 text-left font-medium border-b">Type</th>
                <th className="p-4 text-left font-medium border-b">Current Plan</th>
                <th className="p-4 text-left font-medium border-b">Change Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.type}</td>
                  <td className="p-4">{user.currentPlan}</td>
                  <td className="p-4">
                    <Select
                      value={user.currentPlan}
                      onChange={(plan) => handlePlanChange(user.id, plan)}
                    >
                      {plans.map(plan => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showSuccess && (
        <Alert>
          <Check className="h-4 w-4 text-green-600" />
          <span className="font-semibold">Success</span>
          <span>Plan updates have been saved successfully.</span>
        </Alert>
      )}
    </div>
  );
};

export default PlanManagement;
