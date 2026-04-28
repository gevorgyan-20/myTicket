import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus'; 
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminRoute = () => {
    const { t } = useTranslation();
    const { isAuthenticated, role, isLoading } = useAuthStatus(); 

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">{t('common.loadingDots')}</div>; 
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