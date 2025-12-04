import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/credit', icon: CreditCard, label: 'Credit' },
  { path: '/mpesa', icon: Smartphone, label: 'M-Pesa' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">RetailMaster</h1>
        <p className="subtitle">Business Dashboard</p>
      </div>

      <div className="quick-action">
        <button className="quick-action-btn">
          Quick Sale
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="theme-toggle">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-details">
            <p className="user-name">Kevin Njau Kiarie</p>
            <p className="user-email">kiariekevin48@gmail.com</p>
          </div>
          <button className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
