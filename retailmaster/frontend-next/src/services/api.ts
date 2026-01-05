import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ApiResponse,
  DashboardStats,
  RevenueTrendItem,
  User,
  Product,
  InventoryResponse,
  CreateProductInput,
  UpdateProductInput,
  Credit,
  CreateCreditInput,
  CreditPaymentInput,
  MpesaTransaction,
  CreateMpesaTransactionInput,
  MpesaStats,
} from '@/types';

// API configuration from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token and logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log requests in development
    if (!isProduction) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            // window.location.href = '/login';
          }
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
      console.error('[API] Network error - no response received');
    } else {
      console.error('[API] Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ==================== Dashboard API ====================

export const dashboardAPI = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getRevenueTrend: () => api.get<ApiResponse<RevenueTrendItem[]>>('/dashboard/revenue-trend'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/dashboard/user'),
};

// ==================== Inventory API ====================

export const inventoryAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get<ApiResponse<InventoryResponse>>(`/inventory?page=${page}&limit=${limit}`),
  getById: (id: number) => 
    api.get<ApiResponse<Product>>(`/inventory/${id}`),
  getLowStock: () => 
    api.get<ApiResponse<Product[]>>('/inventory/low-stock'),
  create: (data: CreateProductInput) => 
    api.post<ApiResponse<Product>>('/inventory', data),
  update: (id: number, data: UpdateProductInput) => 
    api.put<ApiResponse<Product>>(`/inventory/${id}`, data),
  delete: (id: number) => 
    api.delete<ApiResponse<void>>(`/inventory/${id}`),
};

// ==================== Credits API ====================

export const creditsAPI = {
  getAll: (page = 1, limit = 20, status: string | null = null) => {
    let url = `/credits?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return api.get<ApiResponse<Credit[]>>(url);
  },
  getOverdue: () => 
    api.get<ApiResponse<Credit[]>>('/credits/overdue'),
  getByCustomer: (customerId: number) => 
    api.get<ApiResponse<Credit[]>>(`/credits/customer/${customerId}`),
  create: (data: CreateCreditInput) => 
    api.post<ApiResponse<Credit>>('/credits', data),
  recordPayment: (creditId: number, data: CreditPaymentInput) => 
    api.post<ApiResponse<Credit>>(`/credits/${creditId}/payment`, data),
};

// ==================== M-Pesa API ====================

export const mpesaAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get<ApiResponse<MpesaTransaction[]>>(`/mpesa?page=${page}&limit=${limit}`),
  getToday: () => 
    api.get<ApiResponse<MpesaTransaction[]>>('/mpesa/today'),
  getStats: () => 
    api.get<ApiResponse<MpesaStats>>('/mpesa/stats'),
  create: (data: CreateMpesaTransactionInput) => 
    api.post<ApiResponse<MpesaTransaction>>('/mpesa', data),
};

// ==================== Health Check ====================

export const healthCheck = () => api.get<ApiResponse<{ message: string }>>('/');

export default api;
