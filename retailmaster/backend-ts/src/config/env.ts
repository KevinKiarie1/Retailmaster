/**
 * Environment Configuration
 * RetailMaster Business Dashboard
 * 
 * Loads and provides access to environment variables
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// If .env doesn't exist, try .env.example
if (!process.env.NODE_ENV) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env.example') });
}

/**
 * Environment utility class
 */
export class Env {
  /**
   * Get an environment variable value
   */
  static get(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
  }

  /**
   * Get an environment variable as a number
   */
  static getNumber(key: string, defaultValue: number = 0): number {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
  }

  /**
   * Get an environment variable as a boolean
   */
  static getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Check if running in production environment
   */
  static isProduction(): boolean {
    return this.get('NODE_ENV', 'development') === 'production';
  }

  /**
   * Check if debug mode is enabled
   */
  static isDebug(): boolean {
    return this.getBoolean('DEBUG', !this.isProduction());
  }
}

/**
 * Application configuration object
 */
export const config = {
  // Server
  port: Env.getNumber('PORT', 8000),
  nodeEnv: Env.get('NODE_ENV', 'development'),
  
  // Database
  database: {
    host: Env.get('DB_HOST', 'localhost'),
    name: Env.get('DB_NAME', 'retailmaster'),
    user: Env.get('DB_USER', 'root'),
    password: Env.get('DB_PASS', ''),
    port: Env.getNumber('DB_PORT', 3306),
  },
  
  // CORS
  allowedOrigins: Env.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(',').map(s => s.trim()),
  
  // Debug
  debug: Env.isDebug(),
  isProduction: Env.isProduction(),
};

export default config;
