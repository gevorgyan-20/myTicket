import API from './apiClient';

export const createTicket = (data) => {
    return API.post('/tickets', data);
};

export const getUserTickets = () => {
    return API.get('/tickets');
};

export const deleteTicket = (ticketId) => {
    return API.delete(`/tickets/${ticketId}`);
};