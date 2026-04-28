import API from './apiClient';

export const getSeatsForEvent = (eventType, eventId, showtimeId = null) => {
    const url = `/${eventType}/${eventId}/seats${showtimeId ? `?showtime_id=${showtimeId}` : ''}`;
    return API.get(url);
};

export const getUserBoughtTicketsCount = (showtimeId) => {
    return API.get(`/showtimes/${showtimeId}/user-ticket-count`);
};
