/**
 * Credit Controller
 * Handles credit management API endpoints
 */

import type { Request, Response } from 'express';
import { Database } from '../config/index.js';
import type { Credit, CreditWithCustomer, CreateCreditInput, CreditPaymentInput, ApiResponse } from '../types/index.js';

/**
 * Get all credits with pagination
 */
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, cu.full_name as customer_name, cu.phone as customer_phone 
      FROM credits c 
      JOIN customers cu ON c.customer_id = cu.id
    `;
    const params: any[] = [];

    if (status) {
      query += ' WHERE c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const credits = await Database.query<CreditWithCustomer>(query, params);
    sendSuccess(res, credits);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get credits by customer
 */
export async function getByCustomer(req: Request, res: Response): Promise<void> {
  try {
    const { customerId } = req.params;

    const credits = await Database.query<Credit>(
      'SELECT * FROM credits WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );

    sendSuccess(res, credits);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Create new credit
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data: CreateCreditInput = req.body;

    // Default due date is 30 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    const dueDate = data.due_date ?? defaultDueDate.toISOString().split('T')[0];

    const insertId = await Database.insert(
      `INSERT INTO credits (customer_id, sale_id, amount, balance, due_date, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.customer_id,
        data.sale_id ?? null,
        data.amount,
        data.amount, // Initial balance equals amount
        dueDate,
        'active',
        data.notes ?? null,
      ]
    );

    sendSuccess(res, { id: insertId, message: 'Credit created successfully' }, 201);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Record credit payment
 */
export async function recordPayment(req: Request, res: Response): Promise<void> {
  const connection = await Database.beginTransaction();

  try {
    const { id: creditId } = req.params;
    const data: CreditPaymentInput = req.body;

    // Get current credit with lock
    const [credits] = await connection.execute(
      'SELECT * FROM credits WHERE id = ? FOR UPDATE',
      [creditId]
    );
    const credit = (credits as Credit[])[0];

    if (!credit) {
      await connection.rollback();
      connection.release();
      sendError(res, new Error('Credit not found'), 404);
      return;
    }

    const paymentAmount = parseFloat(data.amount.toString());
    const newBalance = credit.balance - paymentAmount;

    if (newBalance < 0) {
      await connection.rollback();
      connection.release();
      sendError(res, new Error('Payment amount exceeds balance'), 400);
      return;
    }

    // Insert payment record
    await connection.execute(
      `INSERT INTO credit_payments (credit_id, amount, payment_method, received_by, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        creditId,
        paymentAmount,
        data.payment_method ?? 'cash',
        data.received_by ?? null,
        data.notes ?? null,
      ]
    );

    // Update credit balance and status
    const newStatus = newBalance === 0 ? 'paid' : 'partial';
    await connection.execute(
      'UPDATE credits SET balance = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [newBalance, newStatus, creditId]
    );

    await connection.commit();
    connection.release();

    sendSuccess(res, {
      message: 'Payment recorded successfully',
      new_balance: newBalance,
      status: newStatus,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    sendError(res, error);
  }
}

/**
 * Get overdue credits
 */
export async function getOverdue(req: Request, res: Response): Promise<void> {
  try {
    const credits = await Database.query<CreditWithCustomer>(
      `SELECT c.*, cu.full_name as customer_name, cu.phone as customer_phone 
       FROM credits c 
       JOIN customers cu ON c.customer_id = cu.id
       WHERE (c.status = 'overdue' OR (c.status IN ('active', 'partial') AND c.due_date < CURRENT_DATE))
       ORDER BY c.due_date ASC`
    );

    sendSuccess(res, credits);
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
  console.error('Credit Controller Error:', error);
  const response: ApiResponse = { success: false, error: message };
  res.status(statusCode).json(response);
}

export default {
  getAll,
  getByCustomer,
  create,
  recordPayment,
  getOverdue,
};
