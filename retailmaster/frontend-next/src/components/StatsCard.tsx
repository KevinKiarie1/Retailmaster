'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: number;
  trendLabel?: string;
  valueColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'green',
  trend,
  trendLabel,
  valueColor = 'green'
}) => {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsCardContent}>
        <div className={styles.statsCardInfo}>
          <p className={styles.statsCardTitle}>{title}</p>
          <h2 className={`${styles.statsCardValue} ${styles[valueColor]}`}>{value}</h2>
          {(trend !== undefined || subtitle) && (
            <div className={styles.statsCardFooter}>
              {trend !== undefined && (
                <span className={`${styles.trend} ${trend >= 0 ? styles.positive : styles.negative}`}>
                  {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </span>
              )}
              {trendLabel && <span className={styles.trendLabel}>{trendLabel}</span>}
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${styles.statsCardIcon} ${styles[iconColor]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
