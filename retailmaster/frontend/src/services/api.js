import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueTrend: () => api.get('/dashboard/revenue-trend'),
  getCurrentUser: () => api.get('/dashboard/user'),
};

// Inventory API
export const inventoryAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/inventory?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/inventory/${id}`),
  getLowStock: () => api.get('/inventory/low-stock'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// Credits API
export const creditsAPI = {
  getAll: (page = 1, limit = 20, status = null) => {
    let url = `/credits?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
  getOverdue: () => api.get('/credits/overdue'),
  getByCustomer: (customerId) => api.get(`/credits/customer/${customerId}`),
  create: (data) => api.post('/credits', data),
  recordPayment: (creditId, data) => api.post(`/credits/${creditId}/payment`, data),
};

// M-Pesa API
export const mpesaAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/mpesa?page=${page}&limit=${limit}`),
  getToday: () => api.get('/mpesa/today'),
  getStats: () => api.get('/mpesa/stats'),
  create: (data) => api.post('/mpesa', data),
};

export default api;
