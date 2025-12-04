<?php
/**
 * Dashboard Controller
 * Handles all dashboard-related API endpoints
 */

require_once __DIR__ . '/../config/database.php';

class DashboardController {
    private $conn;
    private $currency = 'KSh';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all dashboard statistics
     */
    public function getStats() {
        try {
            $stats = [
                'totalRevenue' => $this->getTotalRevenue(),
                'revenueChange' => $this->getRevenueChange(),
                'activeCredits' => $this->getActiveCredits(),
                'creditCustomers' => $this->getCreditCustomers(),
                'lowStockItems' => $this->getLowStockItems(),
                'mpesaTransactions' => $this->getMpesaTransactionsToday(),
                'totalProducts' => $this->getTotalProducts(),
                'overdueCredits' => $this->getOverdueCredits(),
                'collectedToday' => $this->getCollectedToday(),
                'currency' => $this->currency
            ];

            return $this->jsonResponse($stats);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get revenue trend for chart
     */
    public function getRevenueTrend() {
        try {
            $query = "SELECT 
                        DATE_FORMAT(sale_date, '%Y-%m') as month,
                        DATE_FORMAT(sale_date, '%b') as month_name,
                        SUM(total_amount) as revenue
                      FROM sales 
                      WHERE sale_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
                      GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b')
                      ORDER BY month";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll();

            return $this->jsonResponse($results);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get total revenue for current month
     */
    private function getTotalRevenue() {
        $query = "SELECT COALESCE(SUM(total_amount), 0) as total 
                  FROM sales 
                  WHERE MONTH(sale_date) = MONTH(CURRENT_DATE) 
                  AND YEAR(sale_date) = YEAR(CURRENT_DATE)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return floatval($result['total']);
    }

    /**
     * Calculate revenue change percentage from last month
     */
    private function getRevenueChange() {
        $currentMonth = $this->getTotalRevenue();
        
        $query = "SELECT COALESCE(SUM(total_amount), 0) as total 
                  FROM sales 
                  WHERE MONTH(sale_date) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)) 
                  AND YEAR(sale_date) = YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        $lastMonth = floatval($result['total']);

        if ($lastMonth == 0) {
            return $currentMonth > 0 ? 100 : 0;
        }

        return round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1);
    }

    /**
     * Get total active credits
     */
    private function getActiveCredits() {
        $query = "SELECT COALESCE(SUM(balance), 0) as total 
                  FROM credits 
                  WHERE status IN ('active', 'partial')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return floatval($result['total']);
    }

    /**
     * Get number of customers with active credits
     */
    private function getCreditCustomers() {
        $query = "SELECT COUNT(DISTINCT customer_id) as count 
                  FROM credits 
                  WHERE status IN ('active', 'partial')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return intval($result['count']);
    }

    /**
     * Get count of low stock items
     */
    private function getLowStockItems() {
        $query = "SELECT COUNT(*) as count 
                  FROM products 
                  WHERE quantity_in_stock <= low_stock_threshold 
                  AND status = 'active'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return intval($result['count']);
    }

    /**
     * Get M-Pesa transactions count for today
     */
    private function getMpesaTransactionsToday() {
        $query = "SELECT COUNT(*) as count 
                  FROM mpesa_transactions 
                  WHERE DATE(transaction_date) = CURRENT_DATE";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return intval($result['count']);
    }

    /**
     * Get total active products count
     */
    private function getTotalProducts() {
        $query = "SELECT COUNT(*) as count 
                  FROM products 
                  WHERE status = 'active'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return intval($result['count']);
    }

    /**
     * Get overdue credits total
     */
    private function getOverdueCredits() {
        $query = "SELECT COALESCE(SUM(balance), 0) as total 
                  FROM credits 
                  WHERE status = 'overdue' 
                  OR (status IN ('active', 'partial') AND due_date < CURRENT_DATE)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return floatval($result['total']);
    }

    /**
     * Get total credit payments collected today
     */
    private function getCollectedToday() {
        $query = "SELECT COALESCE(SUM(amount), 0) as total 
                  FROM credit_payments 
                  WHERE DATE(payment_date) = CURRENT_DATE";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        return floatval($result['total']);
    }

    /**
     * Get current user info
     */
    public function getCurrentUser() {
        try {
            // In a real app, this would use session/JWT auth
            $query = "SELECT id, full_name, email, role, avatar_url FROM users LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $user = $stmt->fetch();

            return $this->jsonResponse($user);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * JSON success response
     */
    private function jsonResponse($data, $code = 200) {
        http_response_code($code);
        return json_encode([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * JSON error response
     */
    private function errorResponse($message, $code = 500) {
        http_response_code($code);
        return json_encode([
            'success' => false,
            'error' => $message
        ]);
    }
}
