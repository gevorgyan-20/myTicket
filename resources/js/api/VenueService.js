import API from './apiClient';

export const getVenues = (type) => {
    const params = type ? { type } : {};
    return API.get('/venues', { params });
};

export const getVenueById = (id) => API.get(`/venues/${id}`);

export const createVenue = (data) => API.post('/admin/venues', data);

export const updateVenue = (id, data) => API.put(`/admin/venues/${id}`, data);

export const deleteVenue = (id) => API.delete(`/admin/venues/${id}`);

// ── Layout Editor ────────────────────────────────────────────────────────────

// Admin: load current draft or published layout for the editor
export const getAdminLayout = (venueId) =>
    API.get(`/admin/venues/${venueId}/layout`);

// Admin: auto-save draft (non-destructive)
export const saveDraftLayout = (venueId, snapshot) =>
    API.post(`/admin/venues/${venueId}/layout/draft`, { snapshot });

// Admin: validate + publish layout
export const publishLayout = (venueId, snapshot) =>
    API.post(`/admin/venues/${venueId}/layout/publish`, { snapshot });

// Public: customer seat-picker loads published layout
export const getPublishedLayout = (venueId, showtimeId) => {
    const params = showtimeId ? { showtime_id: showtimeId } : {};
    return API.get(`/venues/${venueId}/layout`, { params });
};

// Public: load sections for a venue (used by showtime form price inputs)
export const getVenueSections = (venueId) =>
    API.get(`/venues/${venueId}/sections`);
