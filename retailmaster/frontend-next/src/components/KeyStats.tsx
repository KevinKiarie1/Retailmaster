'use client';

import React from 'react';
import { Package, Clock, DollarSign, LucideIcon } from 'lucide-react';
import styles from './KeyStats.module.css';

interface KeyStatsProps {
  totalProducts: number;
  overdueCredits: number;
  collectedToday: number;
  currency?: string;
}

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

const KeyStats: React.FC<KeyStatsProps> = ({ 
  totalProducts, 
  overdueCredits, 
  collectedToday, 
  currency = 'KSh' 
}) => {
  const stats: StatItem[] = [
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
    <div className={styles.keyStatsContainer}>
      <h3 className={styles.keyStatsTitle}>Key Stats</h3>
      <div className={styles.keyStatsList}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={styles.keyStatItem}>
              <div className={`${styles.keyStatIcon} ${styles[stat.color]}`}>
                <Icon size={20} />
              </div>
              <div className={styles.keyStatInfo}>
                <p className={styles.keyStatLabel}>{stat.label}</p>
              </div>
              <p className={`${styles.keyStatValue} ${styles[stat.color]}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyStats;
