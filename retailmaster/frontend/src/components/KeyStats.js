import React from 'react';
import { Package, Clock, DollarSign } from 'lucide-react';
import './KeyStats.css';

const KeyStats = ({ totalProducts, overdueCredits, collectedToday, currency = 'KSh' }) => {
  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: totalProducts,
      color: 'cyan'
    },
    {
      icon: Clock,
      label: 'Overdue Credits',
      value: `${currency} ${overdueCredits.toLocaleString()}`,
      color: 'red'
    },
    {
      icon: DollarSign,
      label: 'Collected Today',
      value: `${currency} ${collectedToday.toLocaleString()}`,
      color: 'white'
    }
  ];

  return (
    <div className="key-stats-container">
      <h3 className="key-stats-title">Key Stats</h3>
      <div className="key-stats-list">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="key-stat-item">
              <div className={`key-stat-icon ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div className="key-stat-info">
                <p className="key-stat-label">{stat.label}</p>
              </div>
              <p className={`key-stat-value ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyStats;
