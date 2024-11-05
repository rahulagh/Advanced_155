// src/components/ExpiringPlans.js
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { fetchUsers } from '../../services/api';

// Updated Card component with full width on larger screens
const Card = ({ children, className }) => (
  <div className={`w-full max-w-7xl mx-auto p-6 shadow-md border rounded-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="card-header">{children}</div>;
const CardTitle = ({ children }) => <h2 className="card-title">{children}</h2>;
const CardContent = ({ children }) => <div className="card-content">{children}</div>;
const Alert = ({ variant, children }) => (
  <div className={`alert ${variant === 'destructive' ? 'alert-danger' : 'alert-default'}`}>
    {children}
  </div>
);
const AlertDescription = ({ children }) => <p className="alert-description">{children}</p>;

const ExpiringPlans = () => {
  const [users, setUsers] = useState([]);
  const [filterDays, setFilterDays] = useState(30);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      const userData = await fetchUsers();
      setUsers(userData);
    };
    loadData();
  }, []);

  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (daysRemaining) => {
    if (daysRemaining <= 7) return 'critical';
    if (daysRemaining <= 30) return 'warning';
    return 'normal';
  };

  const filteredUsers = users.filter(user => {
    const daysRemaining = calculateDaysRemaining(user.planExpiry);
    const typeMatch = filterType === 'all' || user.type === filterType;
    return daysRemaining <= filterDays && typeMatch;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Plan Expiration Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-4">
            <select 
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-1"
            >
              <option value={7}>Next 7 days</option>
              <option value={30}>Next 30 days</option>
              <option value={90}>Next 90 days</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1"
            >
              <option value="all">All Users</option>
              <option value="user">Users Only</option>
              <option value="recruiter">Recruiters Only</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No users found with plans expiring within {filterDays} days.
              </div>
            ) : (
              filteredUsers.map(user => {
                const daysRemaining = calculateDaysRemaining(user.planExpiry);
                const status = getExpiryStatus(daysRemaining);
                
                return (
                  <Alert key={user.id} variant={status === 'critical' ? 'destructive' : 'default'}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <AlertDescription>
                          {user.type.charAt(0).toUpperCase() + user.type.slice(1)} - {user.plan} Plan
                        </AlertDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {daysRemaining} days remaining
                        </div>
                        <div className="text-sm">
                          Expires: {new Date(user.planExpiry).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Alert>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiringPlans;
