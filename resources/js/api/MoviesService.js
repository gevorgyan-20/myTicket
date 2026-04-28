import API from './apiClient';

// ՀԱՆՐԱՅԻՆ ՖՈՒՆԿՑԻԱՆԵՐ (GET)

export const getMovies = (params) => API.get("/movies", { params }); 

export const getMovieById = (id) => API.get(`/movies/${id}`);

// ԱԴՄԻՆԻՍՏՐԱՏԻՎ ՖՈՒՆԿՑԻԱՆԵՐ (CRUD)

export const createMovie = (movieData) => {
    return API.post('/admin/movies', movieData); 
};

export const updateMovie = (id, movieData) => {
    return API.post(`/admin/movies/${id}`, movieData); // Using POST + _method: 'PUT' for file support
};

export const deleteMovie = (id) => {
    return API.delete(`/admin/movies/${id}`);
};