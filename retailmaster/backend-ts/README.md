# RetailMaster Backend - TypeScript

A TypeScript/Express.js backend API for the RetailMaster Business Dashboard, converted from PHP.

## Features

- **TypeScript** - Full type safety and modern ES2022 features
- **ES Modules** - Native ECMAScript modules with proper module resolution
- **Express.js** - Fast, unopinionated web framework
- **MySQL** - Database connection with connection pooling
- **Modular Architecture** - Clean separation of concerns with controllers, routes, and config

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_NAME=retailmaster
   DB_USER=root
   DB_PASS=your_password
   ```

## Development

Start the development server with hot reload (using tsx):
```bash
npm run dev
```

The API will be available at `http://localhost:8000/api`

## Production Build

Build the TypeScript to JavaScript:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Docker

Build and run with Docker:
```bash
docker build -t retailmaster-backend .
docker run -p 8000:8000 --env-file .env retailmaster-backend
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get all dashboard statistics
- `GET /api/dashboard/revenue-trend` - Get revenue trend data for charts
- `GET /api/dashboard/user` - Get current user info

### Inventory/Products
- `GET /api/inventory` - Get all products (paginated)
- `GET /api/inventory/:id` - Get single product
- `GET /api/inventory/low-stock` - Get low stock products
- `POST /api/inventory` - Create new product
- `PUT /api/inventory/:id` - Update product
- `DELETE /api/inventory/:id` - Delete product

### Credits
- `GET /api/credits` - Get all credits (paginated, filterable by status)
- `GET /api/credits/overdue` - Get overdue credits
- `GET /api/credits/customer/:customerId` - Get credits by customer
- `POST /api/credits` - Create new credit
- `POST /api/credits/:id/payment` - Record credit payment

### M-Pesa
- `GET /api/mpesa` - Get all M-Pesa transactions (paginated)
- `GET /api/mpesa/today` - Get today's transactions
- `GET /api/mpesa/stats` - Get M-Pesa statistics
- `POST /api/mpesa` - Record new transaction

## Project Structure

```
backend-ts/
├── src/
│   ├── config/          # Configuration modules
│   │   ├── cors.ts      # CORS configuration
│   │   ├── database.ts  # MySQL connection
│   │   ├── env.ts       # Environment variables
│   │   └── index.ts     # Config exports
│   ├── controllers/     # Request handlers
│   │   ├── CreditController.ts
│   │   ├── DashboardController.ts
│   │   ├── InventoryController.ts
│   │   ├── MpesaController.ts
│   │   └── index.ts
│   ├── routes/          # Route definitions
│   │   ├── api.ts       # All API routes
│   │   └── index.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts         # Server entry point
├── .env.example         # Example environment variables
├── Dockerfile           # Docker build configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check without emitting

## License

MIT
