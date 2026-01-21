import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API functions
export const authAPI = {
    register: async (username, email, password) => {
        const response = await api.post('/register', { username, email, password });
        return response.data;
    },

    login: async (username, password) => {
        const response = await api.post('/login', { username, password });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/me');
        return response.data;
    },
};

// Token management
export const tokenManager = {
    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    removeToken: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

// Ranges API
export const rangesAPI = {
    getAll: async () => {
        const response = await api.get('/api/ranges');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/ranges/${id}`);
        return response.data;
    },

    create: async (rangeData) => {
        const response = await api.post('/api/ranges', rangeData);
        return response.data;
    },

    update: async (id, rangeData) => {
        const response = await api.put(`/api/ranges/${id}`, rangeData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/api/ranges/${id}`);
    },
};

// Nuts API
export const nutsAPI = {
    getAll: async (rangeId = null) => {
        const params = rangeId ? { range_id: rangeId } : {};
        const response = await api.get('/api/nuts', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/nuts/${id}`);
        return response.data;
    },

    create: async (nutData) => {
        const response = await api.post('/api/nuts', nutData);
        return response.data;
    },

    update: async (id, nutData) => {
        const response = await api.put(`/api/nuts/${id}`, nutData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/api/nuts/${id}`);
    },
};

// Screw Lengths API
export const screwLengthsAPI = {
    getAll: async () => {
        const response = await api.get('/api/screw-lengths');
        return response.data;
    },

    create: async (lengthData) => {
        const response = await api.post('/api/screw-lengths', lengthData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/api/screw-lengths/${id}`);
    },
};

export default api;
