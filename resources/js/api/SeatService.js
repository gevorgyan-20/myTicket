import API from './apiClient';

export const getSeatsForEvent = (eventType, eventId) => {
    return API.get(`/${eventType}/${eventId}/seats`);
};
