import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import UserPage from '../pages/UserPage';

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


export default function AppRoutes() {
    const location = useLocation();    
    const state = location.state?.backgroundLocation;

    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        return !!token;
    };

    const [isSignedIn, setIsSignedIn] = useState(checkAuth());

    useEffect(() => {
        const handleAuthChange = () => {
            setIsSignedIn(checkAuth());
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);
    
    

    return (
        <>
            <Routes location={state || location}>
                
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/user" element={<UserPage />} />

                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                
                <Route path="/concerts" element={<ConcertsPage />} />
                <Route path="/concerts/:id" element={<ConcertDetailsPage />} />
                
                <Route path="/standups" element={<StandupsPage />} />
                <Route path="/standups/:id" element={<StandupDetailsPage />} />
                
                <Route path="/:eventType/:eventId/seats" element={<SeatsPage />} />

                <Route path="/register" element={isSignedIn ? <Navigate to="/" replace /> : <RegisterPage />} />
                <Route path="/login" element={isSignedIn ? <Navigate to="/" replace /> : <LoginPage />} />

                <Route path="/admin/*" element={<AdminRoutes />} />
                
                <Route path="*" element={<h1>404 | Page Not Found</h1>} />
            </Routes>

        </>
    )
};
