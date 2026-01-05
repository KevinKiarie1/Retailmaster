/**
 * Type Definitions
 * RetailMaster Business Dashboard
 */

// ==================== Common Types ====================

export interface ApiResponse<T = any> {
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
  status: 'active' | 'inactive' | 'discontinued';
  created_at: Date;
  updated_at: Date;
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
  status?: 'active' | 'inactive' | 'discontinued';
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// ==================== Credit Types ====================

export interface Credit {
  id: number;
  customer_id: number;
  sale_id: number | null;
  amount: number;
  balance: number;
  due_date: Date;
  status: 'active' | 'partial' | 'paid' | 'overdue';
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreditWithCustomer extends Credit {
  customer_name: string;
  customer_phone: string;
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
  payment_method?: 'cash' | 'mpesa' | 'card' | 'bank_transfer';
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
  payment_date: Date;
}

// ==================== M-Pesa Types ====================

export interface MpesaTransaction {
  id: number;
  transaction_id: string;
  phone_number: string;
  amount: number;
  transaction_type: 'payment' | 'refund' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string | null;
  sale_id: number | null;
  credit_payment_id: number | null;
  transaction_date: Date;
  created_at: Date;
}

export interface CreateMpesaTransactionInput {
  transaction_id: string;
  phone_number: string;
  amount: number;
  transaction_type?: 'payment' | 'refund' | 'withdrawal';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
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

// ==================== Customer Types ====================

export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
}
