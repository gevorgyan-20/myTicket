import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoute from '../components/AdminRoute'; 
import HomePage from '../pages/HomePage';

import MovieCreatePage from '../pages/Admin/AdminMovies/MovieCreatePage';
import MovieEditPage from '../pages/Admin/AdminMovies/MovieEditPage';

import ConcertCreatePage from '../pages/Admin/AdminConcerts/ConcertCreatePage';
import ConcertEditPage from '../pages/Admin/AdminConcerts/ConcertEditPage';

import StandupCreatePage from '../pages/Admin/AdminStandups/StandupCreatePage';
import StandupEditPage from '../pages/Admin/AdminStandups/StandupEditPage';

import VenueListPage from '../pages/Admin/AdminVenues/VenueListPage';
import VenueCreatePage from '../pages/Admin/AdminVenues/VenueCreatePage';
import VenueEditPage from '../pages/Admin/AdminVenues/VenueEditPage';


const AdminRoutes = () => (
    <Routes>
        <Route element={<AdminRoute />}> 
            
            <Route index element={<HomePage />} />
            
            <Route path="movies" element={<MovieCreatePage />} /> 
            <Route path="movies/:id" element={<MovieEditPage />} />
            
            <Route path="concerts" element={<ConcertCreatePage />} /> 
            <Route path="concerts/:id" element={<ConcertEditPage />} />

            <Route path="standups" element={<StandupCreatePage />} /> 
            <Route path="standups/:id" element={<StandupEditPage />} />

            <Route path="venues" element={<VenueListPage />} />
            <Route path="venues/create" element={<VenueCreatePage />} />
            <Route path="venues/:id" element={<VenueEditPage />} />

        </Route>
    </Routes>
);

export default AdminRoutes;