'use client';

import React, { useState } from 'react';
import { Check, AlertTriangle, Info, CreditCard, CheckCircle } from 'lucide-react';
import { Notification, NotificationType } from '@/types';
import styles from './page.module.css';

const defaultNotifications: Notification[] = [
  { id: 1, type: 'warning', title: 'Low Stock Alert', message: 'Product "Widget A" is running low (5 items left)', time: '2 hours ago', read: false },
  { id: 2, type: 'info', title: 'New Sale', message: 'Sale #1234 completed for KSh 5,500', time: '3 hours ago', read: false },
  { id: 3, type: 'error', title: 'Credit Overdue', message: 'John Doe\'s credit of KSh 4,200 is overdue', time: '5 hours ago', read: false },
  { id: 4, type: 'success', title: 'Payment Received', message: 'M-Pesa payment of KSh 3,000 received from Jane Smith', time: '6 hours ago', read: true },
  { id: 5, type: 'info', title: 'Daily Report', message: 'Your daily sales report is ready', time: '1 day ago', read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const markAsRead = (id: number): void => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = (): void => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationType): React.ReactNode => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <CreditCard size={20} />;
      case 'success': return <CheckCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Notifications</h1>
          <p className={styles.pageSubtitle}>{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={markAllAsRead}>
            <Check size={18} />
            Mark All Read
          </button>
        )}
      </header>

      <div className={styles.notificationsList}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${styles.notificationItem} ${styles[notification.type]} ${notification.read ? styles.read : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
              {getIcon(notification.type)}
            </div>
            <div className={styles.notificationContent}>
              <h4 className={styles.notificationTitle}>{notification.title}</h4>
              <p className={styles.notificationMessage}>{notification.message}</p>
              <span className={styles.notificationTime}>{notification.time}</span>
            </div>
            {!notification.read && <div className={styles.unreadIndicator}></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
