import React, { useState, useEffect } from 'react';
import { TrendingUp, CreditCard, AlertTriangle, Smartphone } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import KeyStats from '../components/KeyStats';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 12.5,
    activeCredits: 12200,
    creditCustomers: 3,
    lowStockItems: 0,
    mpesaTransactions: 0,
    totalProducts: 0,
    overdueCredits: 0,
    collectedToday: 0,
    currency: 'KSh'
  });

  const [revenueTrend, setRevenueTrend] = useState([
    { month: '2025-01', month_name: 'Jan', revenue: 32000 },
    { month: '2025-02', month_name: 'Feb', revenue: 35000 },
    { month: '2025-03', month_name: 'Mar', revenue: 42000 },
    { month: '2025-04', month_name: 'Apr', revenue: 38000 },
    { month: '2025-05', month_name: 'May', revenue: 45000 },
    { month: '2025-06', month_name: 'Jun', revenue: 52000 },
    { month: '2025-07', month_name: 'Jul', revenue: 48000 },
    { month: '2025-08', month_name: 'Aug', revenue: 55000 },
    { month: '2025-09', month_name: 'Sep', revenue: 58000 },
    { month: '2025-10', month_name: 'Oct', revenue: 62000 },
    { month: '2025-11', month_name: 'Nov', revenue: 65000 },
    { month: '2025-12', month_name: 'Dec', revenue: 58000 },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats and revenue trend
      const [statsRes, trendRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRevenueTrend()
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }

      if (trendRes.data?.success && trendRes.data.data?.length > 0) {
        setRevenueTrend(trendRes.data.data);
      }
    } catch (error) {
      console.log('Using demo data - API not connected');
      // Keep using demo data
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `${stats.currency} ${value.toLocaleString()}`;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
      </header>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          trend={stats.revenueChange}
          trendLabel="from last month"
          icon={TrendingUp}
          iconColor="green"
          valueColor="green"
        />
        <StatsCard
          title="Active Credits"
          value={formatCurrency(stats.activeCredits)}
          subtitle={`— ${stats.creditCustomers} customers`}
          icon={CreditCard}
          iconColor="blue"
          valueColor="white"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          icon={AlertTriangle}
          iconColor="yellow"
          valueColor="red"
        />
        <StatsCard
          title="M-Pesa Transactions"
          value={stats.mpesaTransactions.toString()}
          subtitle="— Today"
          icon={Smartphone}
          iconColor="cyan"
          valueColor="cyan"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-section">
          <RevenueChart data={revenueTrend} />
        </div>
        <div className="key-stats-section">
          <KeyStats
            totalProducts={stats.totalProducts}
            overdueCredits={stats.overdueCredits}
            collectedToday={stats.collectedToday}
            currency={stats.currency}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
