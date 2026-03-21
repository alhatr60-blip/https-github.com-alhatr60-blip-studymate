import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getApiKey = () => localStorage.getItem('gemini_api_key') || '';
export const setApiKey = (key) => localStorage.setItem('gemini_api_key', key);

// Interceptor to add API key to requests if needed
api.interceptors.request.use((config) => {
    // Some endpoints might need the API key in the body, handled in the components
    return config;
});

export default api;
