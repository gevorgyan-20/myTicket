import API from './apiClient';

// ՀԱՆՐԱՅԻՆ ՖՈՒՆԿՑԻԱՆԵՐ (GET)

export const getMovies = () => API.get("/movies"); 

export const getMovieById = (id) => API.get(`/movies/${id}`);

// ԱԴՄԻՆԻՍՏՐԱՏԻՎ ՖՈՒՆԿՑԻԱՆԵՐ (CRUD)

export const createMovie = (movieData) => {
    return API.post('/admin/movies', movieData); 
};

export const updateMovie = (id, movieData) => {
    return API.put(`/admin/movies/${id}`, movieData); 
};

export const deleteMovie = (id) => {
    return API.delete(`/admin/movies/${id}`);
};