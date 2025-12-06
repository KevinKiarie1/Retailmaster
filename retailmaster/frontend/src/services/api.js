import axios from 'axios';

// API configuration from environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const isProduction = process.env.REACT_APP_ENV === 'production';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (!isProduction) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('[API] Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('[API] Resource not found');
          break;
        case 500:
          console.error('[API] Server error');
          break;
        default:
          console.error(`[API] Error: ${data?.error || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API] Network error - no response received');
    } else {
      // Error in request configuration
      console.error('[API] Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

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

// Health check
export const healthCheck = () => api.get('/');

export default api;
