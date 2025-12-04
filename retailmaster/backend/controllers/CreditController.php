<?php
/**
 * Credit Controller
 * Handles credit management API endpoints
 */

require_once __DIR__ . '/../config/database.php';

class CreditController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all credits
     */
    public function getAll($page = 1, $limit = 20, $status = null) {
        try {
            $offset = ($page - 1) * $limit;
            
            $query = "SELECT c.*, cu.full_name as customer_name, cu.phone as customer_phone 
                      FROM credits c 
                      JOIN customers cu ON c.customer_id = cu.id";
            
            if ($status) {
                $query .= " WHERE c.status = :status";
            }
            
            $query .= " ORDER BY c.created_at DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $this->conn->prepare($query);
            if ($status) {
                $stmt->bindParam(':status', $status);
            }
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $credits = $stmt->fetchAll();

            return $this->jsonResponse($credits);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get credits by customer
     */
    public function getByCustomer($customerId) {
        try {
            $query = "SELECT * FROM credits WHERE customer_id = :customer_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':customer_id', $customerId, PDO::PARAM_INT);
            $stmt->execute();
            
            return $this->jsonResponse($stmt->fetchAll());
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Create new credit
     */
    public function create($data) {
        try {
            $query = "INSERT INTO credits (customer_id, sale_id, amount, balance, due_date, status, notes) 
                      VALUES (:customer_id, :sale_id, :amount, :balance, :due_date, :status, :notes)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':customer_id' => $data['customer_id'],
                ':sale_id' => $data['sale_id'] ?? null,
                ':amount' => $data['amount'],
                ':balance' => $data['amount'], // Initial balance equals amount
                ':due_date' => $data['due_date'] ?? date('Y-m-d', strtotime('+30 days')),
                ':status' => 'active',
                ':notes' => $data['notes'] ?? null
            ]);

            $id = $this->conn->lastInsertId();
            return $this->jsonResponse(['id' => $id, 'message' => 'Credit created successfully']);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Record credit payment
     */
    public function recordPayment($creditId, $data) {
        try {
            $this->conn->beginTransaction();

            // Get current credit
            $query = "SELECT * FROM credits WHERE id = :id FOR UPDATE";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $creditId, PDO::PARAM_INT);
            $stmt->execute();
            $credit = $stmt->fetch();

            if (!$credit) {
                throw new Exception('Credit not found');
            }

            $paymentAmount = floatval($data['amount']);
            $newBalance = $credit['balance'] - $paymentAmount;

            if ($newBalance < 0) {
                throw new Exception('Payment amount exceeds balance');
            }

            // Insert payment record
            $paymentQuery = "INSERT INTO credit_payments (credit_id, amount, payment_method, received_by, notes) 
                            VALUES (:credit_id, :amount, :payment_method, :received_by, :notes)";
            $paymentStmt = $this->conn->prepare($paymentQuery);
            $paymentStmt->execute([
                ':credit_id' => $creditId,
                ':amount' => $paymentAmount,
                ':payment_method' => $data['payment_method'] ?? 'cash',
                ':received_by' => $data['received_by'] ?? null,
                ':notes' => $data['notes'] ?? null
            ]);

            // Update credit balance and status
            $newStatus = $newBalance == 0 ? 'paid' : 'partial';
            $updateQuery = "UPDATE credits SET balance = :balance, status = :status WHERE id = :id";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->execute([
                ':balance' => $newBalance,
                ':status' => $newStatus,
                ':id' => $creditId
            ]);

            $this->conn->commit();

            return $this->jsonResponse([
                'message' => 'Payment recorded successfully',
                'new_balance' => $newBalance,
                'status' => $newStatus
            ]);
        } catch (Exception $e) {
            $this->conn->rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get overdue credits
     */
    public function getOverdue() {
        try {
            $query = "SELECT c.*, cu.full_name as customer_name, cu.phone as customer_phone 
                      FROM credits c 
                      JOIN customers cu ON c.customer_id = cu.id
                      WHERE (c.status = 'overdue' OR (c.status IN ('active', 'partial') AND c.due_date < CURRENT_DATE))
                      ORDER BY c.due_date ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $this->jsonResponse($stmt->fetchAll());
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
