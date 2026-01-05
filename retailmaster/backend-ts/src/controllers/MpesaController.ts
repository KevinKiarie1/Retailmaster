/**
 * M-Pesa Controller
 * Handles M-Pesa transaction API endpoints
 */

import type { Request, Response } from 'express';
import { Database } from '../config/index.js';
import type { MpesaTransaction, CreateMpesaTransactionInput, MpesaStats, ApiResponse } from '../types/index.js';

/**
 * Get all M-Pesa transactions with pagination
 */
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const transactions = await Database.query<MpesaTransaction>(
      'SELECT * FROM mpesa_transactions ORDER BY transaction_date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    sendSuccess(res, transactions);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get transactions for today
 */
export async function getToday(req: Request, res: Response): Promise<void> {
  try {
    const transactions = await Database.query<MpesaTransaction>(
      `SELECT * FROM mpesa_transactions 
       WHERE DATE(transaction_date) = CURRENT_DATE 
       ORDER BY transaction_date DESC`
    );

    sendSuccess(res, transactions);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Record new M-Pesa transaction
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data: CreateMpesaTransactionInput = req.body;

    const insertId = await Database.insert(
      `INSERT INTO mpesa_transactions (transaction_id, phone_number, amount, transaction_type, status, reference, sale_id, credit_payment_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.transaction_id,
        data.phone_number,
        data.amount,
        data.transaction_type ?? 'payment',
        data.status ?? 'completed',
        data.reference ?? null,
        data.sale_id ?? null,
        data.credit_payment_id ?? null,
      ]
    );

    sendSuccess(res, { id: insertId, message: 'Transaction recorded successfully' }, 201);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get transaction statistics
 */
export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    // Today's stats
    const todayResult = await Database.queryOne<{ count: number; total: number }>(
      `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
       FROM mpesa_transactions 
       WHERE DATE(transaction_date) = CURRENT_DATE AND status = 'completed'`
    );

    // This month's stats
    const monthResult = await Database.queryOne<{ count: number; total: number }>(
      `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
       FROM mpesa_transactions 
       WHERE MONTH(transaction_date) = MONTH(CURRENT_DATE) 
       AND YEAR(transaction_date) = YEAR(CURRENT_DATE) 
       AND status = 'completed'`
    );

    const stats: MpesaStats = {
      today: {
        count: todayResult?.count ?? 0,
        total: todayResult?.total ?? 0,
      },
      this_month: {
        count: monthResult?.count ?? 0,
        total: monthResult?.total ?? 0,
      },
    };

    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, error);
  }
}

// ==================== Response Helpers ====================

function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  const response: ApiResponse<T> = { success: true, data };
  res.status(statusCode).json(response);
}

function sendError(res: Response, error: unknown, statusCode: number = 500): void {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  console.error('M-Pesa Controller Error:', error);
  const response: ApiResponse = { success: false, error: message };
  res.status(statusCode).json(response);
}

export default {
  getAll,
  getToday,
  create,
  getStats,
};
