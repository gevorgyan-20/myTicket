import API from './apiClient';

export const getVenues = (type) => {
    const params = type ? { type } : {};
    return API.get('/venues', { params });
};

export const getVenueById = (id) => API.get(`/venues/${id}`);

export const createVenue = (data) => API.post('/admin/venues', data);

export const updateVenue = (id, data) => API.put(`/admin/venues/${id}`, data);

export const deleteVenue = (id) => API.delete(`/admin/venues/${id}`);
