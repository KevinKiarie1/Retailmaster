# RetailMaster - Business Dashboard

A full-stack business dashboard application built with PHP, React.js, and MySQL.

## Features

- **Dashboard Overview**: Real-time statistics with revenue trends
- **Inventory Management**: Track products and stock levels
- **Credit Management**: Manage customer credits and payments
- **M-Pesa Integration**: Track mobile money transactions
- **Analytics**: Business insights and performance metrics
- **Notifications**: Real-time alerts and reminders
- **Settings**: Customizable business preferences

## Tech Stack

- **Backend**: PHP 7.4+ with PDO for database operations
- **Frontend**: React.js 18 with React Router
- **Database**: MySQL 8.0
- **Charts**: Recharts library
- **Icons**: Lucide React

## Project Structure

```
retailmaster/
├── backend/                 # PHP Backend
│   ├── api/
│   │   └── index.php       # API router
│   ├── config/
│   │   ├── database.php    # Database configuration
│   │   └── cors.php        # CORS headers
│   ├── controllers/
│   │   ├── DashboardController.php
│   │   ├── InventoryController.php
│   │   ├── CreditController.php
│   │   └── MpesaController.php
│   └── composer.json
├── frontend/                # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── database/
    └── schema.sql          # Database schema
```

## Installation

### Prerequisites

- PHP 7.4 or higher
- MySQL 8.0 or higher
- Node.js 16 or higher
- npm or yarn

### Database Setup

1. database and tables:

```bash
mysql -u root -p < database/schema.sql
```

2. Update database credentials in `backend/config/database.php`:

```php
private $host = ''
private $db_name = ''
private $username = ''
private $password = ''
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Start the PHP development server:

```bash
php -S localhost:8000 -t .
```

The API will be available at `http://localhost:8000/api`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue-trend` - Get revenue trend data
- `GET /api/dashboard/user` - Get current user info

### Inventory
- `GET /api/inventory` - List all products
- `GET /api/inventory/{id}` - Get product by ID
- `GET /api/inventory/low-stock` - Get low stock products
- `POST /api/inventory` - Create new product
- `PUT /api/inventory/{id}` - Update product
- `DELETE /api/inventory/{id}` - Delete product

### Credits
- `GET /api/credits` - List all credits
- `GET /api/credits/overdue` - Get overdue credits
- `POST /api/credits` - Create new credit
- `POST /api/credits/{id}/payment` - Record payment

### M-Pesa
- `GET /api/mpesa` - List all transactions
- `GET /api/mpesa/today` - Get today's transactions
- `GET /api/mpesa/stats` - Get M-Pesa statistics
- `POST /api/mpesa` - Record new transaction

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=retailmaster
DB_USER=your_username
DB_PASS=your_password

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com

# Environment
APP_ENV=production
DEBUG_MODE=false
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

The build files will be in `frontend/build/` directory.

### Backend Deployment

1. Upload the `backend/` folder to your server
2. Create `.env` file with production credentials (never commit this file!)
3. Configure your web server (Apache/Nginx) to point to the backend directory
4. Ensure PHP and MySQL are properly configured
5. Set proper file permissions:
   ```bash
   chmod 755 backend/
   chmod 644 backend/.env
   chmod 755 backend/logs/
   ```

### Security Checklist

- [ ] Set `APP_ENV=production` in backend `.env`
- [ ] Set `DEBUG_MODE=false` in backend `.env`
- [ ] Use strong database password
- [ ] Configure HTTPS/SSL
- [ ] Update `ALLOWED_ORIGINS` to your domain only
- [ ] Remove any test/sample data
- [ ] Set up regular database backups

## License

MIT License

## Author

Kevin Njau Kiarie - kiariekevin48@gmail.com
