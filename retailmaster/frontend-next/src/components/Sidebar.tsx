'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Smartphone,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  LucideIcon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

interface MenuItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/credit', icon: CreditCard, label: 'Credit' },
  { path: '/mpesa', icon: Smartphone, label: 'M-Pesa' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>RetailMaster</h1>
        <p className={styles.subtitle}>Business Dashboard</p>
      </div>

      <div className={styles.quickAction}>
        <button className={styles.quickActionBtn}>
          Quick Sale
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.themeToggle}>
        <button 
          className={styles.themeToggleBtn} 
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User size={20} />
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>Kevin Njau Kiarie</p>
            <p className={styles.userEmail}>kiariekevin48@gmail.com</p>
          </div>
          <button className={styles.logoutBtn} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
