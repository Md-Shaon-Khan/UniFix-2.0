import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import Profile from './pages/Profile';

// Authority Pages
import AuthorityDashboard from './pages/AuthorityDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Common Pages
import Notifications from './pages/Notifications';
import HelpCenter from './pages/HelpCenter';

// Security Wrappers
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentRoute from './components/common/StudentRoute';
import AuthorityRoute from './components/common/AuthorityRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* --- Student Routes (Protected) --- */}
      <Route 
        path="/student-dashboard" 
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        } 
      />
      <Route 
        path="/submit-complaint" 
        element={
          <StudentRoute>
            <SubmitComplaint />
          </StudentRoute>
        } 
      />
      <Route 
        path="/my-complaints" 
        element={
          <StudentRoute>
            {/* Reusing Dashboard with a specific tab is a common pattern */}
            <Navigate to="/student-dashboard" replace />
          </StudentRoute>
        } 
      />

      {/* --- Authority Routes (Protected) --- */}
      <Route 
        path="/authority-dashboard" 
        element={
          <AuthorityRoute>
            <AuthorityDashboard />
          </AuthorityRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <AuthorityRoute>
            <AnalyticsDashboard />
          </AuthorityRoute>
        } 
      />

      {/* --- Shared Protected Routes --- */}
      <Route 
        path="/complaint/:id" 
        element={
          <ProtectedRoute>
            <ComplaintDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/help" 
        element={
          <ProtectedRoute>
            <HelpCenter />
          </ProtectedRoute>
        } 
      />
      
      {/* --- Settings (Redirect to Profile for now) --- */}
      <Route 
        path="/settings" 
        element={<Navigate to="/profile" replace />} 
      />

      {/* --- Fallback (404) --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;