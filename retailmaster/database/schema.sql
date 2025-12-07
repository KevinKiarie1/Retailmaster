-- SQL Database for the Business Dashboard

-- Create database
CREATE DATABASE IF NOT EXISTS retailmaster;
USE retailmaster;

-- Users table (for authentication and user management)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products/Inventory table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    quantity_in_stock INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    credit_limit DECIMAL(10, 2) DEFAULT 0,
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sales/Transactions table
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'mpesa', 'credit', 'card') NOT NULL,
    payment_status ENUM('paid', 'pending', 'partial', 'cancelled') DEFAULT 'paid',
    notes TEXT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sale items (products in each sale)
CREATE TABLE sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Credits table (for tracking customer credits)
CREATE TABLE credits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    sale_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    status ENUM('active', 'paid', 'overdue', 'partial') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL
);

-- Credit payments (tracking payments against credits)
CREATE TABLE credit_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    credit_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'mpesa', 'card') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_by INT,
    notes TEXT,
    FOREIGN KEY (credit_id) REFERENCES credits(id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
);

-- M-Pesa transactions table
CREATE TABLE mpesa_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('payment', 'withdrawal', 'deposit') DEFAULT 'payment',
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    reference VARCHAR(100),
    sale_id INT,
    credit_payment_id INT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL,
    FOREIGN KEY (credit_payment_id) REFERENCES credit_payments(id) ON DELETE SET NULL
);

-- Revenue summary table (for dashboard analytics)
CREATE TABLE revenue_daily (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    total_sales INT DEFAULT 0,
    total_customers INT DEFAULT 0,
    cash_revenue DECIMAL(12, 2) DEFAULT 0,
    mpesa_revenue DECIMAL(12, 2) DEFAULT 0,
    credit_revenue DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('business_name', 'RetailMaster', 'string', 'Business name displayed in the dashboard'),
('currency', 'KSh', 'string', 'Currency symbol'),
('low_stock_threshold', '10', 'number', 'Default low stock threshold'),
('credit_due_days', '30', 'number', 'Default number of days for credit due date');

-- Insert sample user
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Kevin Njau Kiarie', 'kiariekevin48@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Create indexes for better performance
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_credits_customer ON credits(customer_id);
CREATE INDEX idx_credits_status ON credits(status);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_mpesa_date ON mpesa_transactions(transaction_date);

-- Views for dashboard statistics
CREATE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE MONTH(sale_date) = MONTH(CURRENT_DATE) AND YEAR(sale_date) = YEAR(CURRENT_DATE)) as monthly_revenue,
    (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE MONTH(sale_date) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) AND YEAR(sale_date) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))) as last_month_revenue,
    (SELECT COALESCE(SUM(balance), 0) FROM credits WHERE status IN ('active', 'partial')) as active_credits,
    (SELECT COUNT(DISTINCT customer_id) FROM credits WHERE status IN ('active', 'partial')) as credit_customers,
    (SELECT COUNT(*) FROM products WHERE quantity_in_stock <= low_stock_threshold AND status = 'active') as low_stock_items,
    (SELECT COUNT(*) FROM mpesa_transactions WHERE DATE(transaction_date) = CURRENT_DATE) as mpesa_today,
    (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
    (SELECT COALESCE(SUM(balance), 0) FROM credits WHERE status = 'overdue') as overdue_credits,
    (SELECT COALESCE(SUM(amount), 0) FROM credit_payments WHERE DATE(payment_date) = CURRENT_DATE) as collected_today;

-- View for revenue trend (last 12 months)
CREATE VIEW v_revenue_trend AS
SELECT 
    DATE_FORMAT(sale_date, '%Y-%m') as month,
    DATE_FORMAT(sale_date, '%b') as month_name,
    SUM(total_amount) as revenue
FROM sales 
WHERE sale_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b')
ORDER BY month;
