import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
    ? configuredApiUrl.replace(/\/$/, '')
    : `${configuredApiUrl.replace(/\/$/, '')}/api`;

export const api = axios.create({
    baseURL: apiOrigin.replace(/\/$/, '')
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const socketUrl = apiOrigin.replace(/\/api\/?$/, '');

export const assetUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${socketUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
