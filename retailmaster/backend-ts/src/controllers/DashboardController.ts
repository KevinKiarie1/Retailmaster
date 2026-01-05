/**
 * Dashboard Controller
 * Handles all dashboard-related API endpoints
 */

import type { Request, Response } from 'express';
import { Database } from '../config/index.js';
import type { DashboardStats, RevenueTrendItem, User, ApiResponse } from '../types/index.js';

const CURRENCY = 'KSh';

/**
 * Get all dashboard statistics
 */
export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const stats: DashboardStats = {
      totalRevenue: await getTotalRevenue(),
      revenueChange: await getRevenueChange(),
      activeCredits: await getActiveCredits(),
      creditCustomers: await getCreditCustomers(),
      lowStockItems: await getLowStockItems(),
      mpesaTransactions: await getMpesaTransactionsToday(),
      totalProducts: await getTotalProducts(),
      overdueCredits: await getOverdueCredits(),
      collectedToday: await getCollectedToday(),
      currency: CURRENCY,
    };

    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get revenue trend for chart
 */
export async function getRevenueTrend(req: Request, res: Response): Promise<void> {
  try {
    const query = `
      SELECT 
        DATE_FORMAT(sale_date, '%Y-%m') as month,
        DATE_FORMAT(sale_date, '%b') as month_name,
        SUM(total_amount) as revenue
      FROM sales 
      WHERE sale_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b')
      ORDER BY month
    `;

    const results = await Database.query<RevenueTrendItem>(query);
    sendSuccess(res, results);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    // In a real app, this would use session/JWT auth
    const query = 'SELECT id, full_name, email, role, avatar_url FROM users LIMIT 1';
    const user = await Database.queryOne<User>(query);
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, error);
  }
}

// ==================== Private Helper Functions ====================

/**
 * Get total revenue for current month
 */
async function getTotalRevenue(): Promise<number> {
  const result = await Database.queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(total_amount), 0) as total 
    FROM sales 
    WHERE MONTH(sale_date) = MONTH(CURRENT_DATE) 
    AND YEAR(sale_date) = YEAR(CURRENT_DATE)
  `);
  return result?.total ?? 0;
}

/**
 * Calculate revenue change percentage from last month
 */
async function getRevenueChange(): Promise<number> {
  const currentMonth = await getTotalRevenue();

  const result = await Database.queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(total_amount), 0) as total 
    FROM sales 
    WHERE MONTH(sale_date) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) 
    AND YEAR(sale_date) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))
  `);
  const lastMonth = result?.total ?? 0;

  if (lastMonth === 0) {
    return currentMonth > 0 ? 100 : 0;
  }

  return Math.round(((currentMonth - lastMonth) / lastMonth) * 100 * 10) / 10;
}

/**
 * Get total active credits
 */
async function getActiveCredits(): Promise<number> {
  const result = await Database.queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(balance), 0) as total 
    FROM credits 
    WHERE status IN ('active', 'partial')
  `);
  return result?.total ?? 0;
}

/**
 * Get number of customers with active credits
 */
async function getCreditCustomers(): Promise<number> {
  const result = await Database.queryOne<{ count: number }>(`
    SELECT COUNT(DISTINCT customer_id) as count 
    FROM credits 
    WHERE status IN ('active', 'partial')
  `);
  return result?.count ?? 0;
}

/**
 * Get count of low stock items
 */
async function getLowStockItems(): Promise<number> {
  const result = await Database.queryOne<{ count: number }>(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE quantity_in_stock <= low_stock_threshold 
    AND status = 'active'
  `);
  return result?.count ?? 0;
}

/**
 * Get M-Pesa transactions count for today
 */
async function getMpesaTransactionsToday(): Promise<number> {
  const result = await Database.queryOne<{ count: number }>(`
    SELECT COUNT(*) as count 
    FROM mpesa_transactions 
    WHERE DATE(transaction_date) = CURRENT_DATE
  `);
  return result?.count ?? 0;
}

/**
 * Get total active products count
 */
async function getTotalProducts(): Promise<number> {
  const result = await Database.queryOne<{ count: number }>(`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE status = 'active'
  `);
  return result?.count ?? 0;
}

/**
 * Get overdue credits total
 */
async function getOverdueCredits(): Promise<number> {
  const result = await Database.queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(balance), 0) as total 
    FROM credits 
    WHERE status = 'overdue' 
    OR (status IN ('active', 'partial') AND due_date < CURRENT_DATE)
  `);
  return result?.total ?? 0;
}

/**
 * Get total credit payments collected today
 */
async function getCollectedToday(): Promise<number> {
  const result = await Database.queryOne<{ total: number }>(`
    SELECT COALESCE(SUM(amount), 0) as total 
    FROM credit_payments 
    WHERE DATE(payment_date) = CURRENT_DATE
  `);
  return result?.total ?? 0;
}

// ==================== Response Helpers ====================

function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  const response: ApiResponse<T> = { success: true, data };
  res.status(statusCode).json(response);
}

function sendError(res: Response, error: unknown, statusCode: number = 500): void {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  console.error('Dashboard Controller Error:', error);
  const response: ApiResponse = { success: false, error: message };
  res.status(statusCode).json(response);
}

export default {
  getStats,
  getRevenueTrend,
  getCurrentUser,
};
