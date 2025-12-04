import React from 'react';
import { Route } from 'react-router-dom';

import AdminRoute from '../components/AdminRoute'; 
import HomePage from '../pages/HomePage';

import MovieCreatePage from '../pages/Admin/AdminMovies/MovieCreatePage';
import MovieEditPage from '../pages/Admin/AdminMovies/MovieEditPage';

import ConcertCreatePage from '../pages/Admin/AdminConcerts/ConcertCreatePage';
import ConcertEditPage from '../pages/Admin/AdminConcerts/ConcertEditPage';

import StandupCreatePage from '../pages/Admin/AdminStandups/StandupCreatePage';
import StandupEditPage from '../pages/Admin/AdminStandups/StandupEditPage';


const AdminRoutes = () => (
    <Route element={<AdminRoute />}> 
        
        <Route path="/admin" element={<HomePage />} />
        
        <Route path="/admin/movies" element={<MovieCreatePage />} /> 
        <Route path="/admin/movies/:id" element={<MovieEditPage />} />
        
        <Route path="/admin/concerts" element={<ConcertCreatePage />} /> 
        <Route path="/admin/concerts/:id" element={<ConcertEditPage />} />

        <Route path="/admin/standups" element={<StandupCreatePage />} /> 
        <Route path="/admin/standups/:id" element={<StandupEditPage />} />

    </Route>
);

export default AdminRoutes;