import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import PlanManagement from './pages/PlanManagement';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Define the root route */}
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile-detail" element={<ProfileDetail />} />
                <Route path="/plan-management" element={<PlanManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/user-management" element={<UserManagement />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
