import React, { useState } from 'react';
import { Bell, Check, AlertTriangle, Info, Package, CreditCard, CheckCircle } from 'lucide-react';
import './PageStyles.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'Low Stock Alert', message: 'Product "Widget A" is running low (5 items left)', time: '2 hours ago', read: false },
    { id: 2, type: 'info', title: 'New Sale', message: 'Sale #1234 completed for KSh 5,500', time: '3 hours ago', read: false },
    { id: 3, type: 'error', title: 'Credit Overdue', message: 'John Doe\'s credit of KSh 4,200 is overdue', time: '5 hours ago', read: false },
    { id: 4, type: 'success', title: 'Payment Received', message: 'M-Pesa payment of KSh 3,000 received from Jane Smith', time: '6 hours ago', read: true },
    { id: 5, type: 'info', title: 'Daily Report', message: 'Your daily sales report is ready', time: '1 day ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <CreditCard size={20} />;
      case 'success': return <CheckCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            <Check size={18} />
            Mark All Read
          </button>
        )}
      </header>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.type} ${notification.read ? 'read' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className={`notification-icon ${notification.type}`}>
              {getIcon(notification.type)}
            </div>
            <div className="notification-content">
              <h4 className="notification-title">{notification.title}</h4>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
