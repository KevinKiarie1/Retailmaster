# RetailMaster Frontend - Next.js TypeScript

A modern, responsive business dashboard built with Next.js 14, TypeScript, and React.

## Features

- 📊 **Dashboard** - Overview of key business metrics and revenue trends
- 📦 **Inventory Management** - Track products and stock levels
- 💳 **Credit Management** - Monitor customer credits and payments
- 📱 **M-Pesa Integration** - Track mobile money transactions
- 📈 **Analytics** - Business insights and performance metrics
- 🔔 **Notifications** - Real-time alerts and updates
- ⚙️ **Settings** - Configure business preferences

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENV=development
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build Docker image
docker build -t retailmaster-frontend .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8000/api retailmaster-frontend
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard page
│   ├── inventory/         # Inventory management
│   ├── credit/            # Credit management
│   ├── mpesa/             # M-Pesa transactions
│   ├── analytics/         # Analytics page
│   ├── notifications/     # Notifications page
│   └── settings/          # Settings page
├── components/            # Reusable components
│   ├── Layout.tsx        # Main layout with sidebar
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── StatsCard.tsx     # Statistics card component
│   ├── RevenueChart.tsx  # Revenue trend chart
│   └── KeyStats.tsx      # Key statistics display
├── context/              # React contexts
│   └── ThemeContext.tsx  # Theme provider (dark/light mode)
├── services/             # API services
│   └── api.ts            # Axios API client
├── styles/               # Global styles
│   └── globals.css       # CSS variables and base styles
└── types/                # TypeScript type definitions
    └── index.ts          # All type interfaces
```

## API Integration

The frontend connects to the RetailMaster backend API. Make sure the backend server is running and the `NEXT_PUBLIC_API_URL` is configured correctly.

### Available API Endpoints

- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/revenue-trend` - Revenue trend data
- `GET /inventory` - Product listing
- `GET /credits` - Credit listing
- `GET /mpesa/today` - Today's M-Pesa transactions
- `GET /mpesa/stats` - M-Pesa statistics

## Theme Support

The application supports both dark and light themes. Toggle between themes using the button in the sidebar. Theme preference is persisted in localStorage.

## License

MIT
