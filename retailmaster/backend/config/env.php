<?php
/**
 * Environment Configuration Loader
 * RetailMaster Business Dashboard
 * 
 * Loads environment variables from .env file
 */

class Env {
    private static $loaded = false;
    private static $vars = [];

    /**
     * Load environment variables from .env file
     */
    public static function load($path = null) {
        if (self::$loaded) {
            return;
        }

        $envFile = $path ?: dirname(__DIR__) . '/.env';
        
        if (!file_exists($envFile)) {
            // Fall back to .env.example in development
            $envFile = dirname(__DIR__) . '/.env.example';
        }

        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            
            foreach ($lines as $line) {
                // Skip comments
                if (strpos(trim($line), '#') === 0) {
                    continue;
                }

                // Parse KEY=VALUE
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value);
                    
                    // Remove quotes if present
                    $value = trim($value, '"\'');
                    
                    self::$vars[$key] = $value;
                    
                    // Set as environment variable
                    if (!getenv($key)) {
                        putenv("$key=$value");
                    }
                }
            }
        }

        self::$loaded = true;
    }

    /**
     * Get environment variable
     */
    public static function get($key, $default = null) {
        self::load();
        
        // Check our loaded vars first
        if (isset(self::$vars[$key])) {
            return self::$vars[$key];
        }
        
        // Then check system environment
        $value = getenv($key);
        
        return $value !== false ? $value : $default;
    }

    /**
     * Check if running in production
     */
    public static function isProduction() {
        return self::get('APP_ENV', 'development') === 'production';
    }

    /**
     * Check if debug mode is enabled
     */
    public static function isDebug() {
        return self::get('DEBUG_MODE', 'false') === 'true';
    }
}
