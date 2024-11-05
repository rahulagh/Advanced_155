import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanManagementPage from './pages/PlanManagementPage';
import UserManagement from './pages/UserManagement';
import UsageHistoryPage from './pages/UsageHistoryPage';
import SettingsPage from './pages/SettingsPage';  // Importing SettingsPage
import { AuthProvider } from './context/AuthContext';
import RecruiterManagementPage from './pages/RecruiterManagementPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileList from './components/RecruiterManagement/ProfileList'; // Importing ProfileList

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/plan-management" element={<PlanManagementPage />} />
          <Route path="/user-management/*" element={<UserManagement />} />
          <Route path="/usage-history" element={<UsageHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} /> 
          
          {/* Adding the recruiter profile list route */}
          <Route path="/recruiter-profiles" element={<ProfileList />} />
          
          <Route path="/Recruiter-Management" element={<RecruiterManagementPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
