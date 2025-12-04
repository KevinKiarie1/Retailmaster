<?php
/**
 * M-Pesa Controller
 * Handles M-Pesa transaction API endpoints
 */

require_once __DIR__ . '/../config/database.php';

class MpesaController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all M-Pesa transactions
     */
    public function getAll($page = 1, $limit = 20) {
        try {
            $offset = ($page - 1) * $limit;
            
            $query = "SELECT * FROM mpesa_transactions ORDER BY transaction_date DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            return $this->jsonResponse($stmt->fetchAll());
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get transactions for today
     */
    public function getToday() {
        try {
            $query = "SELECT * FROM mpesa_transactions 
                      WHERE DATE(transaction_date) = CURRENT_DATE 
                      ORDER BY transaction_date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $this->jsonResponse($stmt->fetchAll());
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Record new M-Pesa transaction
     */
    public function create($data) {
        try {
            $query = "INSERT INTO mpesa_transactions (transaction_id, phone_number, amount, transaction_type, status, reference, sale_id, credit_payment_id) 
                      VALUES (:transaction_id, :phone_number, :amount, :transaction_type, :status, :reference, :sale_id, :credit_payment_id)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':transaction_id' => $data['transaction_id'],
                ':phone_number' => $data['phone_number'],
                ':amount' => $data['amount'],
                ':transaction_type' => $data['transaction_type'] ?? 'payment',
                ':status' => $data['status'] ?? 'completed',
                ':reference' => $data['reference'] ?? null,
                ':sale_id' => $data['sale_id'] ?? null,
                ':credit_payment_id' => $data['credit_payment_id'] ?? null
            ]);

            $id = $this->conn->lastInsertId();
            return $this->jsonResponse(['id' => $id, 'message' => 'Transaction recorded successfully']);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get transaction statistics
     */
    public function getStats() {
        try {
            $stats = [];
            
            // Today's stats
            $query = "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
                      FROM mpesa_transactions 
                      WHERE DATE(transaction_date) = CURRENT_DATE AND status = 'completed'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $today = $stmt->fetch();
            $stats['today'] = $today;

            // This month's stats
            $query = "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
                      FROM mpesa_transactions 
                      WHERE MONTH(transaction_date) = MONTH(CURRENT_DATE) 
                      AND YEAR(transaction_date) = YEAR(CURRENT_DATE) 
                      AND status = 'completed'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $month = $stmt->fetch();
            $stats['this_month'] = $month;

            return $this->jsonResponse($stats);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    private function jsonResponse($data, $code = 200) {
        http_response_code($code);
        return json_encode(['success' => true, 'data' => $data]);
    }

    private function errorResponse($message, $code = 500) {
        http_response_code($code);
        return json_encode(['success' => false, 'error' => $message]);
    }
}
