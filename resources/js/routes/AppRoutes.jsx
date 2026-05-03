import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import UserPage from '../pages/UserPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import NotFoundPage from '../pages/NotFoundPage';

import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

import MoviesPage from '../pages/Movies/MoviesPage';
import MovieDetailsPage from '../pages/Movies/MovieDetailsPage';

import ConcertsPage from '../pages/Concerts/ConcertsPage';
import ConcertDetailsPage from '../pages/Concerts/ConcertDetailsPage';

import StandupsPage from '../pages/Standups/StandupsPage';
import StandupDetailsPage from '../pages/Standups/StandupDetailsPage';

import AdminRoutes from './AdminRoutes'; 
import SeatsPage from '../pages/SeatsPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import SuccessPage from '../pages/Checkout/SuccessPage';

export default function AppRoutes() {
    const location = useLocation();    
    const state = location.state?.backgroundLocation;

    const { isAuthenticated, role, isLoading } = useAuthStatus();
    
    if (isLoading) {
        return null;
    }

    if (isAuthenticated && role === 'admin' && !location.pathname.startsWith('/admin')) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <>
            <Routes location={state || location}>
                
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                
                <Route path="/concerts" element={<ConcertsPage />} />
                <Route path="/concerts/:id" element={<ConcertDetailsPage />} />
                
                <Route path="/standups" element={<StandupsPage />} />
                <Route path="/standups/:id" element={<StandupDetailsPage />} />
                
                <Route path="/:eventType/:eventId/seats" element={<SeatsPage />} />
                
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<SuccessPage />} />

                <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

                <Route path="/admin/*" element={<AdminRoutes />} />
                
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </>
    )
};
