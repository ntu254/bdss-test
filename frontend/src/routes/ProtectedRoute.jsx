// frontendv2/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Sử dụng useAuth hook
import LoadingSpinner from '../components/common/LoadingSpinner'; // Component spinner

const ProtectedRoute = ({ requiredRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while auth state is being determined
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check role requirements if specified
    if (requiredRoles && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
        // Make sure user has a role and it's in the required roles list
        if (!user?.role || !requiredRoles.includes(user.role)) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;