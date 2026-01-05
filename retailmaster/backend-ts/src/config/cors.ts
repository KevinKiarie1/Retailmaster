/**
 * CORS Configuration
 * RetailMaster Business Dashboard
 */

import type { CorsOptions } from 'cors';
import { config } from './env.js';

/**
 * CORS configuration options
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests) in debug mode
    if (!origin && config.debug) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (origin && config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (!config.isProduction) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 3600,
};

export default corsOptions;
