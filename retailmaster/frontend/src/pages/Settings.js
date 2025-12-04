import React, { useState } from 'react';
import { Save, Store, DollarSign, Bell, Shield, Database } from 'lucide-react';
import './PageStyles.css';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'RetailMaster',
    currency: 'KSh',
    lowStockThreshold: 10,
    creditDueDays: 30,
    emailNotifications: true,
    lowStockAlerts: true,
    creditReminders: true,
    dailyReports: false,
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    // Save settings to API
    alert('Settings saved successfully!');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Configure your business preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save Changes
        </button>
      </header>

      <div className="settings-grid">
        {/* Business Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Store size={20} />
            <h3>Business Information</h3>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Database size={20} />
            <h3>Inventory Settings</h3>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value))}
              />
              <p className="form-help">Alert when stock falls below this number</p>
            </div>
          </div>
        </div>

        {/* Credit Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <DollarSign size={20} />
            <h3>Credit Settings</h3>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Default Credit Due Days</label>
              <input
                type="number"
                value={settings.creditDueDays}
                onChange={(e) => handleChange('creditDueDays', parseInt(e.target.value))}
              />
              <p className="form-help">Default number of days for credit due date</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={20} />
            <h3>Notifications</h3>
          </div>
          <div className="settings-form">
            <div className="form-group toggle">
              <div className="toggle-info">
                <label>Email Notifications</label>
                <p className="form-help">Receive notifications via email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group toggle">
              <div className="toggle-info">
                <label>Low Stock Alerts</label>
                <p className="form-help">Get alerted when items are running low</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.lowStockAlerts}
                  onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group toggle">
              <div className="toggle-info">
                <label>Credit Reminders</label>
                <p className="form-help">Reminders for overdue credits</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.creditReminders}
                  onChange={(e) => handleChange('creditReminders', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group toggle">
              <div className="toggle-info">
                <label>Daily Reports</label>
                <p className="form-help">Receive daily business summary</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.dailyReports}
                  onChange={(e) => handleChange('dailyReports', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
