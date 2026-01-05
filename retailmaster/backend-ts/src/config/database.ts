/**
 * Database Configuration
 * RetailMaster Business Dashboard
 * 
 * MySQL database connection using mysql2 with connection pooling
 */

import mysql from 'mysql2/promise';
import { config } from './env.js';

/**
 * Database connection pool
 */
const pool = mysql.createPool({
  host: config.database.host,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Database utility class
 */
export class Database {
  /**
   * Get a connection from the pool
   */
  static async getConnection(): Promise<mysql.PoolConnection> {
    try {
      return await pool.getConnection();
    } catch (error) {
      console.error('Database connection error:', error);
      if (config.debug) {
        throw new Error(`Database connection failed: ${(error as Error).message}`);
      }
      throw new Error('Database connection failed. Please try again later.');
    }
  }

  /**
   * Execute a query with parameters
   */
  static async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as T[];
    } finally {
      connection.release();
    }
  }

  /**
   * Execute a query and return a single row
   */
  static async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] || null;
  }

  /**
   * Execute an insert query and return the insert ID
   */
  static async insert(sql: string, params?: any[]): Promise<number> {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.execute(sql, params) as [mysql.ResultSetHeader, any];
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  /**
   * Execute an update/delete query and return affected rows
   */
  static async execute(sql: string, params?: any[]): Promise<number> {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.execute(sql, params) as [mysql.ResultSetHeader, any];
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }

  /**
   * Begin a transaction
   */
  static async beginTransaction(): Promise<mysql.PoolConnection> {
    const connection = await this.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  /**
   * Close the database pool
   */
  static async close(): Promise<void> {
    await pool.end();
  }
}

export { pool };
export default Database;
