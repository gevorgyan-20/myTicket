import API from './apiClient';

export const getShowtimes = (eventId, eventType) => {
    return API.get('/showtimes', { params: { event_id: eventId, event_type: eventType } });
};

export const getShowtimeById = (id) => {
    return API.get(`/showtimes/${id}`);
};

export const createShowtime = (showtimeData) => {
    return API.post('/admin/showtimes', showtimeData);
};

export const updateShowtime = (id, showtimeData) => {
    return API.put(`/admin/showtimes/${id}`, showtimeData);
};

export const deleteShowtime = (id) => {
    return API.delete(`/admin/showtimes/${id}`);
};

export const getShowtimeSectionPrices = (showtimeId) => {
    return API.get(`/showtimes/${showtimeId}/section-prices`);
};
