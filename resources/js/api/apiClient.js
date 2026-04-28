import axios from "axios";

const TOKEN_KEY = 'authToken';

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const API = axios.create({
    baseURL: "/api",
    headers: {
        'Accept': 'application/json',
    },
});

API.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    response => {
        const token = response.data.access_token;
        if (token) {
            saveToken(token);
        }
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            removeToken();
        }
        return Promise.reject(error);
    }
);

export default API;