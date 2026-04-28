import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoute from '../components/AdminRoute'; 
import AdminLayout from '../components/AdminLayout';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';

import MovieCreatePage from '../pages/Admin/AdminMovies/MovieCreatePage';
import MovieEditPage from '../pages/Admin/AdminMovies/MovieEditPage';

import ConcertCreatePage from '../pages/Admin/AdminConcerts/ConcertCreatePage';
import ConcertEditPage from '../pages/Admin/AdminConcerts/ConcertEditPage';

import StandupCreatePage from '../pages/Admin/AdminStandups/StandupCreatePage';
import StandupEditPage from '../pages/Admin/AdminStandups/StandupEditPage';

import VenueListPage from '../pages/Admin/AdminVenues/VenueListPage';
import VenueCreatePage from '../pages/Admin/AdminVenues/VenueCreatePage';
import VenueEditPage from '../pages/Admin/AdminVenues/VenueEditPage';
import VenueLayoutEditor from '../pages/Admin/AdminVenues/VenueLayoutEditor';


const AdminRoutes = () => (
    <Routes>
        <Route element={<AdminRoute />}> 
            <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                
                <Route path="movies" element={<MovieCreatePage />} /> 
                <Route path="movies/:id" element={<MovieEditPage />} />
                
                <Route path="concerts" element={<ConcertCreatePage />} /> 
                <Route path="concerts/:id" element={<ConcertEditPage />} />

                <Route path="standups" element={<StandupCreatePage />} /> 
                <Route path="standups/:id" element={<StandupEditPage />} />

                <Route path="venues" element={<VenueListPage />} />
                <Route path="venues/create" element={<VenueCreatePage />} />
                <Route path="venues/:id" element={<VenueEditPage />} />
                {/* Layout editor — full-page, rendered outside AdminLayout */}
                <Route path="venues/:id/layout" element={<VenueLayoutEditor />} />
            </Route>
        </Route>
    </Routes>
);

export default AdminRoutes;