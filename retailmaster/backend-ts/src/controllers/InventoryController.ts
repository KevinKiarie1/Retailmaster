/**
 * Inventory Controller
 * Handles inventory/products API endpoints
 */

import type { Request, Response } from 'express';
import { Database } from '../config/index.js';
import type { Product, CreateProductInput, UpdateProductInput, ApiResponse, PaginationInfo } from '../types/index.js';

/**
 * Get all products with pagination
 */
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const products = await Database.query<Product>(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const countResult = await Database.queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM products'
    );
    const total = countResult?.total ?? 0;

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    sendSuccess(res, { products, pagination });
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get single product by ID
 */
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const product = await Database.queryOne<Product>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!product) {
      sendError(res, new Error('Product not found'), 404);
      return;
    }

    sendSuccess(res, product);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Create new product
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data: CreateProductInput = req.body;

    const insertId = await Database.insert(
      `INSERT INTO products (name, sku, description, category, unit_price, cost_price, quantity_in_stock, low_stock_threshold, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.sku ?? null,
        data.description ?? null,
        data.category ?? null,
        data.unit_price,
        data.cost_price ?? null,
        data.quantity_in_stock ?? 0,
        data.low_stock_threshold ?? 10,
        data.status ?? 'active',
      ]
    );

    const product = await Database.queryOne<Product>(
      'SELECT * FROM products WHERE id = ?',
      [insertId]
    );

    sendSuccess(res, product, 201);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Update product
 */
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data: UpdateProductInput = req.body;

    // Check if product exists
    const existing = await Database.queryOne<Product>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!existing) {
      sendError(res, new Error('Product not found'), 404);
      return;
    }

    await Database.execute(
      `UPDATE products SET 
        name = ?, 
        sku = ?, 
        description = ?, 
        category = ?, 
        unit_price = ?, 
        cost_price = ?, 
        quantity_in_stock = ?, 
        low_stock_threshold = ?, 
        status = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        data.name ?? existing.name,
        data.sku ?? existing.sku,
        data.description ?? existing.description,
        data.category ?? existing.category,
        data.unit_price ?? existing.unit_price,
        data.cost_price ?? existing.cost_price,
        data.quantity_in_stock ?? existing.quantity_in_stock,
        data.low_stock_threshold ?? existing.low_stock_threshold,
        data.status ?? existing.status,
        id,
      ]
    );

    const product = await Database.queryOne<Product>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    sendSuccess(res, product);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Delete product
 */
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const affectedRows = await Database.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (affectedRows === 0) {
      sendError(res, new Error('Product not found'), 404);
      return;
    }

    sendSuccess(res, { message: 'Product deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get low stock products
 */
export async function getLowStock(req: Request, res: Response): Promise<void> {
  try {
    const products = await Database.query<Product>(
      `SELECT * FROM products 
       WHERE quantity_in_stock <= low_stock_threshold 
       AND status = 'active' 
       ORDER BY quantity_in_stock ASC`
    );

    sendSuccess(res, products);
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
  console.error('Inventory Controller Error:', error);
  const response: ApiResponse = { success: false, error: message };
  res.status(statusCode).json(response);
}

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteProduct,
  getLowStock,
};
