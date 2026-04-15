import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({ baseURL: API_URL });

// Attach token from localStorage on every request
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors globally
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export const api = {
    get: <T>(url: string, params?: Record<string, any>) =>
        client.get<T>(url, { params }).then((r) => r.data),

    post: <T>(url: string, data?: any) =>
        client.post<T>(url, data).then((r) => r.data),

    patch: <T>(url: string, data?: any) =>
        client.patch<T>(url, data).then((r) => r.data),

    put: <T>(url: string, data?: any) =>
        client.put<T>(url, data).then((r) => r.data),

    delete: <T>(url: string) =>
        client.delete<T>(url).then((r) => r.data),
};

export default api;
