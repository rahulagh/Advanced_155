import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchAnalyticsData } from '../services/api'; // Import your API functions
import { UserCircle, Users, CreditCard, BarChart2, Settings, LogOut, Menu, Home } from 'lucide-react';
import UsageHistoryPage from '../pages/UsageHistoryPage';
import UserManagement from '../pages/UserManagement';
import PlanManagementPage from '../pages/PlanManagementPage';
import SettingsPage from '../pages/SettingsPage';
import RecruiterManagementPage from '../pages/RecruiterManagementPage';

const Sidebar = ({ activeItem, setActiveItem, isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: <Home />, label: 'Home' },
    { icon: <UserCircle />, label: 'Users' },
    { icon: <Users />, label: 'Recruiters' },
    { icon: <CreditCard />, label: 'Plans' },
    { icon: <BarChart2 />, label: 'Usage History' },
    { icon: <Settings />, label: 'Settings' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} h-screen bg-gray-800 text-white p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h2 className="text-2xl font-bold">Admin Portal</h2>}
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700">
          <Menu size={24} />
        </button>
      </div>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-4">
              <button
                className={`flex items-center w-full p-2 rounded ${activeItem === item.label ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveItem(item.label)}
              >
                {item.icon}
                {isOpen && <span className="ml-2">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="flex items-center w-full p-2 rounded hover:bg-red-600 mt-auto"
        onClick={() => console.log('Logout clicked')}
      >
        <LogOut />
        {isOpen && <span className="ml-2">Logout</span>}
      </button>
    </div>
  );
};

const DashboardContent = ({ activeItem }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeRecruiters, setActiveRecruiters] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        const analytics = await fetchAnalyticsData();

        setTotalUsers(users.length); // Assuming users is an array
        setActiveRecruiters(analytics.activeRecruiters); // Adjust based on your backend response
        setInactiveUsers(analytics.inactiveUsers); // Assuming backend returns inactive user count in analytics data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Fetch data on component mount

  return (
    <div className="p-6">
      {activeItem === 'Home' && (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h2>
          <p className="mb-4">Here's an overview of your system:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Active Recruiters</h3>
              <p className="text-2xl font-bold">{activeRecruiters}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Inactive Users</h3>
              <p className="text-2xl font-bold">{inactiveUsers}</p>
            </div>
          </div>
        </>
      )}
      {activeItem === 'Users' && <UserManagement />}
      {activeItem === 'Recruiters' && <RecruiterManagementPage />}
      {activeItem === 'Plans' && <PlanManagementPage />}
      {activeItem === 'Usage History' && <UsageHistoryPage />}
      {activeItem === 'Settings' && <SettingsPage />}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 overflow-auto">
        <DashboardContent activeItem={activeItem} />
      </div>
    </div>
  );
};

export default AdminDashboard;
