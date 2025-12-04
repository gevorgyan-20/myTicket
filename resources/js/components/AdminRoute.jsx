import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus'; 
import React from 'react';

const AdminRoute = () => {
    const { isAuthenticated, role, isLoading } = useAuthStatus(); 

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'admin') {
        return <Navigate to="/" replace />; 
    }

    return <Outlet />; 
};

export default AdminRoute;