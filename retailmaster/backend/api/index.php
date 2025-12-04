<?php
/**
 * API Router
 * RetailMaster Business Dashboard
 * Main entry point for all API requests
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/DashboardController.php';
require_once __DIR__ . '/../controllers/InventoryController.php';
require_once __DIR__ . '/../controllers/CreditController.php';
require_once __DIR__ . '/../controllers/MpesaController.php';

// Parse the request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

// Remove 'api' prefix if present
if (isset($uri[0]) && $uri[0] === 'api') {
    array_shift($uri);
}

$resource = $uri[0] ?? '';
$id = $uri[1] ?? null;
$action = $uri[2] ?? null;

$method = $_SERVER['REQUEST_METHOD'];

// Get request body for POST/PUT requests
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Query parameters
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$status = $_GET['status'] ?? null;

try {
    switch ($resource) {
        case 'dashboard':
            $controller = new DashboardController();
            if ($id === 'stats') {
                echo $controller->getStats();
            } elseif ($id === 'revenue-trend') {
                echo $controller->getRevenueTrend();
            } elseif ($id === 'user') {
                echo $controller->getCurrentUser();
            } else {
                echo $controller->getStats();
            }
            break;

        case 'inventory':
        case 'products':
            $controller = new InventoryController();
            switch ($method) {
                case 'GET':
                    if ($id === 'low-stock') {
                        echo $controller->getLowStock();
                    } elseif ($id) {
                        echo $controller->getById($id);
                    } else {
                        echo $controller->getAll($page, $limit);
                    }
                    break;
                case 'POST':
                    echo $controller->create($input);
                    break;
                case 'PUT':
                    if ($id) {
                        echo $controller->update($id, $input);
                    }
                    break;
                case 'DELETE':
                    if ($id) {
                        echo $controller->delete($id);
                    }
                    break;
            }
            break;

        case 'credits':
            $controller = new CreditController();
            switch ($method) {
                case 'GET':
                    if ($id === 'overdue') {
                        echo $controller->getOverdue();
                    } elseif ($id === 'customer' && $action) {
                        echo $controller->getByCustomer($action);
                    } else {
                        echo $controller->getAll($page, $limit, $status);
                    }
                    break;
                case 'POST':
                    if ($id && $action === 'payment') {
                        echo $controller->recordPayment($id, $input);
                    } else {
                        echo $controller->create($input);
                    }
                    break;
            }
            break;

        case 'mpesa':
            $controller = new MpesaController();
            switch ($method) {
                case 'GET':
                    if ($id === 'today') {
                        echo $controller->getToday();
                    } elseif ($id === 'stats') {
                        echo $controller->getStats();
                    } else {
                        echo $controller->getAll($page, $limit);
                    }
                    break;
                case 'POST':
                    echo $controller->create($input);
                    break;
            }
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Endpoint not found',
                'available_endpoints' => [
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
                    'POST /api/credits',
                    'POST /api/credits/{id}/payment',
                    'GET /api/mpesa',
                    'GET /api/mpesa/today',
                    'GET /api/mpesa/stats',
                    'POST /api/mpesa'
                ]
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}
