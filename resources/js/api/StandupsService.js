import API from './apiClient';

// ՀԱՆՐԱՅԻՆ ՖՈՒՆԿՑԻԱՆԵՐ (GET)
export const getStandups = (params) => API.get("/standups", { params }); 
export const getStandupById = (id) => API.get(`/standups/${id}`);

// ԱԴՄԻՆԻՍՏՐԱՏԻՎ ՖՈՒՆԿՑԻԱՆԵՐ (CRUD)
export const createStandup = (standupData) => {
    return API.post('/admin/standups', standupData); 
};

export const updateStandup = (id, standupData) => {
    return API.post(`/admin/standups/${id}`, standupData); 
};

export const deleteStandup = (id) => {
    return API.delete(`/admin/standups/${id}`);
};