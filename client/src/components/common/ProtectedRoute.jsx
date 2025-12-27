import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Fixed named import
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // 1. Loading State (Prevents premature redirect on refresh)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center text-blue-600">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-sm font-medium text-gray-500">Verifying access...</span>
                </div>
            </div>
        );
    }

    // 2. Not Authenticated? -> Redirect to Login
    if (!isAuthenticated) {
        // Save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Role Check (Admin bypasses restrictions)
    const userRole = user?.role;
    if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
        // Redirect based on their actual role to prevent "Unauthorized" dead-ends
        const redirectPath = userRole === 'authority' ? '/authority-dashboard' : '/student-dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    // 4. Access Granted
    return children;
};

export default ProtectedRoute;