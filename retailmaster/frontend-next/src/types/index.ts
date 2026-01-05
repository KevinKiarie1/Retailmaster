/**
 * Type Definitions
 * RetailMaster Business Dashboard - Next.js Frontend
 */

import { ComponentType } from 'react';

// ==================== Common Types ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// ==================== Dashboard Types ====================

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeCredits: number;
  creditCustomers: number;
  lowStockItems: number;
  mpesaTransactions: number;
  totalProducts: number;
  overdueCredits: number;
  collectedToday: number;
  currency: string;
}

export interface RevenueTrendItem {
  month: string;
  month_name: string;
  revenue: number;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

// ==================== Product/Inventory Types ====================

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface Product {
  id: number;
  name: string;
  sku: string | null;
  description: string | null;
  category: string | null;
  unit_price: number;
  cost_price: number | null;
  quantity_in_stock: number;
  low_stock_threshold: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  unit_price: number;
  cost_price?: number;
  quantity_in_stock?: number;
  low_stock_threshold?: number;
  status?: ProductStatus;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface InventoryResponse {
  products: Product[];
  pagination: PaginationInfo;
}

// ==================== Credit Types ====================

export type CreditStatus = 'active' | 'partial' | 'paid' | 'overdue';
export type PaymentMethod = 'cash' | 'mpesa' | 'card' | 'bank_transfer';

export interface Credit {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  sale_id: number | null;
  amount: number;
  balance: number;
  due_date: string;
  status: CreditStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCreditInput {
  customer_id: number;
  sale_id?: number;
  amount: number;
  due_date?: string;
  notes?: string;
}

export interface CreditPaymentInput {
  amount: number;
  payment_method?: PaymentMethod;
  received_by?: string;
  notes?: string;
}

export interface CreditPayment {
  id: number;
  credit_id: number;
  amount: number;
  payment_method: string;
  received_by: string | null;
  notes: string | null;
  payment_date: string;
}

// ==================== M-Pesa Types ====================

export type TransactionType = 'payment' | 'refund' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface MpesaTransaction {
  id: number;
  transaction_id: string;
  phone_number: string;
  amount: number;
  transaction_type: TransactionType;
  status: TransactionStatus;
  reference: string | null;
  sale_id: number | null;
  credit_payment_id: number | null;
  transaction_date: string;
  created_at: string;
}

export interface CreateMpesaTransactionInput {
  transaction_id: string;
  phone_number: string;
  amount: number;
  transaction_type: TransactionType;
  reference?: string;
  sale_id?: number;
  credit_payment_id?: number;
}

export interface MpesaStats {
  today: {
    count: number;
    total: number;
  };
  this_month: {
    count: number;
    total: number;
  };
}

// ==================== Analytics Types ====================

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

// ==================== Notification Types ====================

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ==================== Settings Types ====================

export interface Settings {
  businessName: string;
  currency: string;
  lowStockThreshold: number;
  creditDueDays: number;
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  creditReminders: boolean;
  dailyReports: boolean;
}

// ==================== Component Props Types ====================

export interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ComponentType<{ size?: number }>;
  iconColor?: string;
  trend?: number;
  trendLabel?: string;
  valueColor?: string;
}

export interface KeyStatsProps {
  totalProducts: number;
  overdueCredits: number;
  collectedToday: number;
  currency?: string;
}

export interface RevenueChartProps {
  data: RevenueTrendItem[];
}
