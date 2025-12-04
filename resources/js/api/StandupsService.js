import API from './apiClient';

// ՀԱՆՐԱՅԻՆ ՖՈՒՆԿՑԻԱՆԵՐ (GET)
export const getStandups = () => API.get("/standups"); 
export const getStandupById = (id) => API.get(`/standups/${id}`);

// ԱԴՄԻՆԻՍՏՐԱՏԻՎ ՖՈՒՆԿՑԻԱՆԵՐ (CRUD)
export const createStandup = (standupData) => {
    return API.post('/admin/standups', standupData); 
};

export const updateStandup = (id, standupData) => {
    return API.put(`/admin/standups/${id}`, standupData); 
};

export const deleteStandup = (id) => {
    return API.delete(`/admin/standups/${id}`);
};