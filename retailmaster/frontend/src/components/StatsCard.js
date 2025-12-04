import React from 'react';
import './StatsCard.css';

const StatsCard = ({ 
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
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-card-info">
          <p className="stats-card-title">{title}</p>
          <h2 className={`stats-card-value ${valueColor}`}>{value}</h2>
          {(trend || subtitle) && (
            <div className="stats-card-footer">
              {trend && (
                <span className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
                  {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </span>
              )}
              {trendLabel && <span className="trend-label">{trendLabel}</span>}
              {subtitle && <span className="subtitle">{subtitle}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`stats-card-icon ${iconColor}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
