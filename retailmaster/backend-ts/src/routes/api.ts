/**
 * API Routes
 * RetailMaster Business Dashboard
 * 
 * Defines all API endpoints matching the original PHP API structure
 */

import { Router } from 'express';
import {
  DashboardController,
  InventoryController,
  CreditController,
  MpesaController,
} from '../controllers/index.js';

const router = Router();

// ==================== Dashboard Routes ====================

router.get('/dashboard/stats', DashboardController.getStats);
router.get('/dashboard/revenue-trend', DashboardController.getRevenueTrend);
router.get('/dashboard/user', DashboardController.getCurrentUser);
router.get('/dashboard', DashboardController.getStats); // Default endpoint

// ==================== Inventory/Products Routes ====================

router.get('/inventory/low-stock', InventoryController.getLowStock);
router.get('/inventory/:id', InventoryController.getById);
router.get('/inventory', InventoryController.getAll);
router.post('/inventory', InventoryController.create);
router.put('/inventory/:id', InventoryController.update);
router.delete('/inventory/:id', InventoryController.delete);

// Alias for products endpoint
router.get('/products/low-stock', InventoryController.getLowStock);
router.get('/products/:id', InventoryController.getById);
router.get('/products', InventoryController.getAll);
router.post('/products', InventoryController.create);
router.put('/products/:id', InventoryController.update);
router.delete('/products/:id', InventoryController.delete);

// ==================== Credits Routes ====================

router.get('/credits/overdue', CreditController.getOverdue);
router.get('/credits/customer/:customerId', CreditController.getByCustomer);
router.get('/credits', CreditController.getAll);
router.post('/credits/:id/payment', CreditController.recordPayment);
router.post('/credits', CreditController.create);

// ==================== M-Pesa Routes ====================

router.get('/mpesa/today', MpesaController.getToday);
router.get('/mpesa/stats', MpesaController.getStats);
router.get('/mpesa', MpesaController.getAll);
router.post('/mpesa', MpesaController.create);

export default router;
