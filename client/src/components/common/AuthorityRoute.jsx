import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Fixed: Named import
import { Loader2 } from 'lucide-react';

const AuthorityRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for Auth Check to finish
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Verifying authority access...</p>
        </div>
      </div>
    );
  }

  // 2. Not Logged In? -> Go to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in but WRONG Role? -> Go to Student Dashboard
  if (user?.role !== 'authority' && user?.role !== 'admin') {
    return <Navigate to="/student-dashboard" replace />;
  }

  // 4. Access Granted
  return children;
};

export default AuthorityRoute;