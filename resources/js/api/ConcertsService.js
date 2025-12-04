import API from './apiClient';

// ՀԱՆՐԱՅԻՆ ՖՈՒՆԿՑԻԱՆԵՐ (GET)
export const getConcerts = () => API.get("/concerts"); 
export const getConcertById = (id) => API.get(`/concerts/${id}`);

// ԱԴՄԻՆԻՍՏՐԱՏԻՎ ՖՈՒՆԿՑԻԱՆԵՐ (CRUD)
export const createConcert = (concertData) => {
    return API.post('/admin/concerts', concertData); 
};

export const updateConcert = (id, concertData) => {
    return API.put(`/admin/concerts/${id}`, concertData); 
};

export const deleteConcert = (id) => {
    return API.delete(`/admin/concerts/${id}`);
};