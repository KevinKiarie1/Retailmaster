<?php
/**
 * CORS Configuration
 * RetailMaster Business Dashboard
 * 
 * Production-ready with environment variable support
 */

require_once __DIR__ . '/env.php';

// Get allowed origins from environment
$allowedOriginsStr = Env::get('ALLOWED_ORIGINS', 'http://localhost:3000');
$allowedOrigins = array_map('trim', explode(',', $allowedOriginsStr));

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (Env::isDebug() && empty($origin)) {
    // Allow requests without origin in debug mode (e.g., Postman, curl)
    header("Access-Control-Allow-Origin: *");
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Security headers for production
if (Env::isProduction()) {
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
