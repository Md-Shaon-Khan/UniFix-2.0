import axios from 'axios';

// 1. BASE CONFIGURATION
const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. AUTOMATIC TOKEN ATTACHMENT (Interceptor)
// This ensures every request sends the token if it exists in LocalStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('unifix_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 3. GLOBAL ERROR HANDLING
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 Unauthorized (Token expired/invalid), auto-logout
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('unifix_token');
            localStorage.removeItem('unifix_user');
            // Optional: Redirect to login if not already there
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// 4. API SERVICES
export const authAPI = {
    login: (email, password, role) => api.post('/auth/login', { email, password, role }),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

export const complaintAPI = {
    getAll: () => api.get('/complaints'),
    getById: (id) => api.get(`/complaints/${id}`),
    create: (data) => api.post('/complaints', data),
    vote: (id) => api.post(`/complaints/${id}/vote`),
    updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
    delete: (id) => api.delete(`/complaints/${id}`),
};

export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
};

export const analyticsAPI = {
    // If backend doesn't support these yet, we handle logic in frontend (as implemented)
    // But keeping these here allows easy scaling later.
    getSummary: () => api.get('/analytics/summary'),
    getTrends: () => api.get('/analytics/trends'),
};

// Helper to manually set token (usually handled by interceptor now, but kept for safety)
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;