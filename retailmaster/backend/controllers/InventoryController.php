<?php
/**
 * Inventory Controller
 * Handles inventory/products API endpoints
 */

require_once __DIR__ . '/../config/database.php';

class InventoryController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all products
     */
    public function getAll($page = 1, $limit = 20) {
        try {
            $offset = ($page - 1) * $limit;
            
            $query = "SELECT * FROM products ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $products = $stmt->fetchAll();
            
            // Get total count
            $countQuery = "SELECT COUNT(*) as total FROM products";
            $countStmt = $this->conn->prepare($countQuery);
            $countStmt->execute();
            $total = $countStmt->fetch()['total'];

            return $this->jsonResponse([
                'products' => $products,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get single product
     */
    public function getById($id) {
        try {
            $query = "SELECT * FROM products WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $product = $stmt->fetch();
            
            if (!$product) {
                return $this->errorResponse('Product not found', 404);
            }

            return $this->jsonResponse($product);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Create new product
     */
    public function create($data) {
        try {
            $query = "INSERT INTO products (name, sku, description, category, unit_price, cost_price, quantity_in_stock, low_stock_threshold, status) 
                      VALUES (:name, :sku, :description, :category, :unit_price, :cost_price, :quantity_in_stock, :low_stock_threshold, :status)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':name' => $data['name'],
                ':sku' => $data['sku'] ?? null,
                ':description' => $data['description'] ?? null,
                ':category' => $data['category'] ?? null,
                ':unit_price' => $data['unit_price'],
                ':cost_price' => $data['cost_price'] ?? null,
                ':quantity_in_stock' => $data['quantity_in_stock'] ?? 0,
                ':low_stock_threshold' => $data['low_stock_threshold'] ?? 10,
                ':status' => $data['status'] ?? 'active'
            ]);

            $id = $this->conn->lastInsertId();
            return $this->getById($id);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Update product
     */
    public function update($id, $data) {
        try {
            $query = "UPDATE products SET 
                        name = :name, 
                        sku = :sku, 
                        description = :description, 
                        category = :category, 
                        unit_price = :unit_price, 
                        cost_price = :cost_price, 
                        quantity_in_stock = :quantity_in_stock, 
                        low_stock_threshold = :low_stock_threshold, 
                        status = :status 
                      WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':id' => $id,
                ':name' => $data['name'],
                ':sku' => $data['sku'] ?? null,
                ':description' => $data['description'] ?? null,
                ':category' => $data['category'] ?? null,
                ':unit_price' => $data['unit_price'],
                ':cost_price' => $data['cost_price'] ?? null,
                ':quantity_in_stock' => $data['quantity_in_stock'] ?? 0,
                ':low_stock_threshold' => $data['low_stock_threshold'] ?? 10,
                ':status' => $data['status'] ?? 'active'
            ]);

            return $this->getById($id);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Delete product
     */
    public function delete($id) {
        try {
            $query = "DELETE FROM products WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $this->jsonResponse(['message' => 'Product deleted successfully']);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get low stock products
     */
    public function getLowStock() {
        try {
            $query = "SELECT * FROM products 
                      WHERE quantity_in_stock <= low_stock_threshold 
                      AND status = 'active' 
                      ORDER BY quantity_in_stock ASC";
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
