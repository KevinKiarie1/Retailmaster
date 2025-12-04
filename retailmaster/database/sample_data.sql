-- Sample Data for RetailMaster Dashboard
-- Run this after schema.sql to populate with demo data

USE retailmaster;

-- Insert sample customers
INSERT INTO customers (full_name, email, phone, address, credit_limit, status) VALUES
('John Doe', 'john.doe@email.com', '0712345678', '123 Main St, Nairobi', 50000, 'active'),
('Jane Smith', 'jane.smith@email.com', '0723456789', '456 Oak Ave, Mombasa', 30000, 'active'),
('Mike Johnson', 'mike.j@email.com', '0734567890', '789 Pine Rd, Kisumu', 25000, 'active'),
('Sarah Wilson', 'sarah.w@email.com', '0745678901', '321 Elm St, Nakuru', 40000, 'active'),
('David Brown', 'david.b@email.com', '0756789012', '654 Cedar Ln, Eldoret', 35000, 'active');

-- Insert sample products
INSERT INTO products (name, sku, description, category, unit_price, cost_price, quantity_in_stock, low_stock_threshold, status) VALUES
('Smartphone X100', 'PHONE-001', 'Latest smartphone with advanced features', 'Electronics', 45000, 35000, 25, 10, 'active'),
('Wireless Earbuds Pro', 'AUDIO-001', 'High-quality wireless earbuds', 'Electronics', 3500, 2000, 50, 15, 'active'),
('Smart Watch S3', 'WATCH-001', 'Fitness tracking smartwatch', 'Electronics', 12000, 8000, 8, 10, 'active'),
('Cotton T-Shirt', 'CLOTH-001', '100% cotton comfortable t-shirt', 'Clothing', 1500, 800, 100, 20, 'active'),
('Denim Jeans', 'CLOTH-002', 'Classic denim jeans', 'Clothing', 3500, 2000, 60, 15, 'active'),
('Running Shoes', 'SHOES-001', 'Comfortable running shoes', 'Footwear', 5500, 3500, 5, 10, 'active'),
('Cooking Oil 5L', 'FOOD-001', 'Premium vegetable cooking oil', 'Food', 1200, 900, 200, 50, 'active'),
('Rice 10kg', 'FOOD-002', 'Long grain rice', 'Food', 2800, 2200, 150, 30, 'active'),
('Sugar 2kg', 'FOOD-003', 'White sugar', 'Food', 350, 280, 300, 50, 'active'),
('Laptop Pro 15', 'COMP-001', '15-inch professional laptop', 'Electronics', 85000, 65000, 12, 5, 'active');

-- Insert sample sales
INSERT INTO sales (customer_id, user_id, total_amount, payment_method, payment_status, sale_date) VALUES
(1, 1, 48500, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 1, 15500, 'cash', 'paid', DATE_SUB(NOW(), INTERVAL 28 DAY)),
(3, 1, 32000, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(4, 1, 45000, 'credit', 'pending', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(5, 1, 8500, 'cash', 'paid', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 1, 25000, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 1, 52000, 'credit', 'pending', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(3, 1, 18500, 'cash', 'paid', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(4, 1, 65000, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 1, 38000, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(1, 1, 42000, 'cash', 'paid', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 1, 28500, 'mpesa', 'paid', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 1, 55000, 'credit', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert sale items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 45000, 45000),
(1, 2, 1, 3500, 3500),
(2, 4, 5, 1500, 7500),
(2, 5, 2, 3500, 7000),
(2, 9, 3, 350, 1050),
(3, 3, 2, 12000, 24000),
(3, 2, 2, 3500, 7000),
(3, 9, 3, 350, 1050),
(4, 1, 1, 45000, 45000),
(5, 6, 1, 5500, 5500),
(5, 8, 1, 2800, 2800),
(5, 7, 1, 1200, 1200);

-- Insert credits
INSERT INTO credits (customer_id, sale_id, amount, balance, due_date, status) VALUES
(4, 4, 45000, 30000, DATE_ADD(NOW(), INTERVAL 15 DAY), 'partial'),
(2, 7, 52000, 52000, DATE_ADD(NOW(), INTERVAL 5 DAY), 'active'),
(3, 13, 55000, 55000, DATE_ADD(NOW(), INTERVAL 25 DAY), 'active'),
(1, NULL, 8200, 8200, DATE_SUB(NOW(), INTERVAL 5 DAY), 'overdue');

-- Insert credit payments
INSERT INTO credit_payments (credit_id, amount, payment_method, received_by, payment_date) VALUES
(1, 15000, 'mpesa', 1, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Insert M-Pesa transactions
INSERT INTO mpesa_transactions (transaction_id, phone_number, amount, transaction_type, status, reference, sale_id, transaction_date) VALUES
('QHB12345KL', '0712345678', 48500, 'payment', 'completed', 'Sale #1', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
('QHB12346KM', '0734567890', 32000, 'payment', 'completed', 'Sale #3', 3, DATE_SUB(NOW(), INTERVAL 25 DAY)),
('QHB12347KN', '0712345678', 25000, 'payment', 'completed', 'Sale #6', 6, DATE_SUB(NOW(), INTERVAL 18 DAY)),
('QHB12348KO', '0745678901', 65000, 'payment', 'completed', 'Sale #9', 9, DATE_SUB(NOW(), INTERVAL 10 DAY)),
('QHB12349KP', '0756789012', 38000, 'payment', 'completed', 'Sale #10', 10, DATE_SUB(NOW(), INTERVAL 8 DAY)),
('QHB12350KQ', '0723456789', 28500, 'payment', 'completed', 'Sale #12', 12, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('QHB12351KR', '0745678901', 15000, 'payment', 'completed', 'Credit Payment', NULL, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Insert revenue daily data (for chart)
INSERT INTO revenue_daily (date, total_revenue, total_sales, total_customers, cash_revenue, mpesa_revenue, credit_revenue) VALUES
(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), 32000, 45, 28, 12000, 15000, 5000),
(DATE_SUB(CURDATE(), INTERVAL 10 MONTH), 35000, 52, 32, 14000, 16000, 5000),
(DATE_SUB(CURDATE(), INTERVAL 9 MONTH), 42000, 58, 35, 15000, 20000, 7000),
(DATE_SUB(CURDATE(), INTERVAL 8 MONTH), 38000, 48, 30, 13000, 18000, 7000),
(DATE_SUB(CURDATE(), INTERVAL 7 MONTH), 45000, 62, 38, 16000, 22000, 7000),
(DATE_SUB(CURDATE(), INTERVAL 6 MONTH), 52000, 70, 42, 18000, 25000, 9000),
(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), 48000, 65, 40, 17000, 23000, 8000),
(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), 55000, 72, 45, 19000, 27000, 9000),
(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 58000, 78, 48, 20000, 28000, 10000),
(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 62000, 82, 50, 22000, 30000, 10000),
(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 65000, 88, 52, 23000, 32000, 10000),
(CURDATE(), 58000, 75, 48, 20000, 28000, 10000);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(1, 'Low Stock Alert', 'Product "Running Shoes" is running low (5 items left)', 'warning', 0),
(1, 'Low Stock Alert', 'Product "Smart Watch S3" is running low (8 items left)', 'warning', 0),
(1, 'Credit Overdue', 'John Doe\'s credit of KSh 8,200 is overdue', 'error', 0),
(1, 'Payment Received', 'M-Pesa payment of KSh 28,500 received from Jane Smith', 'success', 1),
(1, 'New Sale', 'Sale #13 completed for KSh 55,000', 'info', 1);

SELECT 'Sample data inserted successfully!' as Message;
