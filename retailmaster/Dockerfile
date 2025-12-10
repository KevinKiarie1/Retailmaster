# ===========================================
# RetailMaster - Multi-stage Docker Build
# ===========================================

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build for production
RUN npm run build

# Stage 2: PHP Backend + Nginx
FROM php:8.2-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql

# Create directories
RUN mkdir -p /var/www/html /var/log/supervisor /run/nginx

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/http.d/default.conf

# Copy Supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy backend files
COPY backend/ /var/www/html/api/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/build /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && mkdir -p /var/www/html/api/logs \
    && chown -R www-data:www-data /var/www/html/api/logs

# Expose port
EXPOSE 80

# Start Supervisor (manages Nginx + PHP-FPM)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
