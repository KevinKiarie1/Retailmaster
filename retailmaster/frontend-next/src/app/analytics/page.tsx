'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MonthlyData, CategoryData, TopProduct } from '@/types';
import styles from './page.module.css';

const monthlyData: MonthlyData[] = [
  { month: 'Jan', revenue: 32000, expenses: 18000 },
  { month: 'Feb', revenue: 35000, expenses: 20000 },
  { month: 'Mar', revenue: 42000, expenses: 22000 },
  { month: 'Apr', revenue: 38000, expenses: 19000 },
  { month: 'May', revenue: 45000, expenses: 24000 },
  { month: 'Jun', revenue: 52000, expenses: 26000 },
];

const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 35, color: '#10b981' },
  { name: 'Clothing', value: 25, color: '#3b82f6' },
  { name: 'Food', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 20, color: '#6b7280' },
];

const topProducts: TopProduct[] = [
  { name: 'Product A', sales: 150, revenue: 45000 },
  { name: 'Product B', sales: 120, revenue: 36000 },
  { name: 'Product C', sales: 95, revenue: 28500 },
  { name: 'Product D', sales: 80, revenue: 24000 },
  { name: 'Product E', sales: 65, revenue: 19500 },
];

export default function Analytics() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Analytics</h1>
          <p className={styles.pageSubtitle}>Business insights and performance metrics</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className={styles.analyticsStats}>
        <div className={styles.analyticsStatCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>KSh 244,000</h3>
            <p className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} /> +12.5%
            </p>
          </div>
        </div>
        <div className={styles.analyticsStatCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <ShoppingCart size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Sales</p>
            <h3 className={styles.statValue}>1,245</h3>
            <p className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} /> +8.3%
            </p>
          </div>
        </div>
        <div className={styles.analyticsStatCard}>
          <div className={`${styles.statIcon} ${styles.yellow}`}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Customers</p>
            <h3 className={styles.statValue}>324</h3>
            <p className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={14} /> +5.2%
            </p>
          </div>
        </div>
        <div className={styles.analyticsStatCard}>
          <div className={`${styles.statIcon} ${styles.cyan}`}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Products</p>
            <h3 className={styles.statValue}>156</h3>
            <p className={`${styles.statChange} ${styles.negative}`}>
              <TrendingDown size={14} /> -2.1%
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.analyticsCharts}>
        <div className={`${styles.chartCard} ${styles.large}`}>
          <h3>Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.chartLegend}>
            {categoryData.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendLabel}>{item.name}</span>
                <span className={styles.legendValue}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className={styles.topProductsSection}>
        <div className={styles.chartCard}>
          <h3>Top Selling Products</h3>
          <div className={styles.topProductsList}>
            {topProducts.map((product, index) => (
              <div key={index} className={styles.topProductItem}>
                <div className={styles.productRank}>{index + 1}</div>
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productSales}>{product.sales} sales</p>
                </div>
                <div className={styles.productRevenue}>
                  KSh {product.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
