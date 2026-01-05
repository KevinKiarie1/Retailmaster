/**
 * RetailMaster Business Dashboard
 * TypeScript Backend API Server
 * 
 * Main entry point for the Express server
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config, corsOptions, Database } from './config/index.js';
import { apiRouter } from './routes/index.js';
import { ApiResponse } from './types/index.js';

const app = express();

// ==================== Middleware ====================

// CORS configuration
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (!config.isProduction) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Security headers for production
if (config.isProduction) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
}

// ==================== Routes ====================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    },
  });
});

// API routes - mount at /api
app.use('/api', apiRouter);

// Also support routes without /api prefix for compatibility
app.use('/', apiRouter);

// ==================== Error Handling ====================

// 404 handler
app.use((req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: 'Endpoint not found',
  };

  // Add available endpoints info in development
  if (config.debug) {
    (response as any).available_endpoints = [
      'GET /api/dashboard/stats',
      'GET /api/dashboard/revenue-trend',
      'GET /api/dashboard/user',
      'GET /api/inventory',
      'GET /api/inventory/{id}',
      'GET /api/inventory/low-stock',
      'POST /api/inventory',
      'PUT /api/inventory/{id}',
      'DELETE /api/inventory/{id}',
      'GET /api/credits',
      'GET /api/credits/overdue',
      'GET /api/credits/customer/{customerId}',
      'POST /api/credits',
      'POST /api/credits/{id}/payment',
      'GET /api/mpesa',
      'GET /api/mpesa/today',
      'GET /api/mpesa/stats',
      'POST /api/mpesa',
    ];
  }

  res.status(404).json(response);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);

  const response: ApiResponse = {
    success: false,
    error: config.debug ? err.message : 'An unexpected error occurred',
  };

  if (config.debug && err.stack) {
    (response as any).stack = err.stack;
  }

  res.status(500).json(response);
});

// ==================== Server Startup ====================

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   RetailMaster API Server                              ║
║                                                        ║
║   Environment: ${config.nodeEnv.padEnd(38)}║
║   Port: ${PORT.toString().padEnd(46)}║
║   Debug: ${config.debug.toString().padEnd(45)}║
║                                                        ║
║   API Base: http://localhost:${PORT}/api${' '.repeat(19)}║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await Database.close();
    console.log('Database connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await Database.close();
    console.log('Database connection closed.');
    process.exit(0);
  });
});

export default app;
