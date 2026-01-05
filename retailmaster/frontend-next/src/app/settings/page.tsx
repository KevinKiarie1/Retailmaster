'use client';

import React, { useState } from 'react';
import { Save, Store, DollarSign, Bell, Database } from 'lucide-react';
import { Settings as SettingsType } from '@/types';
import styles from './page.module.css';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    businessName: 'RetailMaster',
    currency: 'KSh',
    lowStockThreshold: 10,
    creditDueDays: 30,
    emailNotifications: true,
    lowStockAlerts: true,
    creditReminders: true,
    dailyReports: false,
  });

  const handleChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]): void => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = (): void => {
    // Save settings to API
    alert('Settings saved successfully!');
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Settings</h1>
          <p className={styles.pageSubtitle}>Configure your business preferences</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>
          <Save size={18} />
          Save Changes
        </button>
      </header>

      <div className={styles.settingsGrid}>
        {/* Business Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <Store size={20} />
            <h3>Business Information</h3>
          </div>
          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
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
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <Database size={20} />
            <h3>Inventory Settings</h3>
          </div>
          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Low Stock Threshold</label>
              <input
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
              />
              <p className={styles.formHelp}>Alert when stock falls below this number</p>
            </div>
          </div>
        </div>

        {/* Credit Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <DollarSign size={20} />
            <h3>Credit Settings</h3>
          </div>
          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Default Credit Due Days</label>
              <input
                type="number"
                value={settings.creditDueDays}
                onChange={(e) => handleChange('creditDueDays', parseInt(e.target.value) || 0)}
              />
              <p className={styles.formHelp}>Default number of days for credit due date</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <Bell size={20} />
            <h3>Notifications</h3>
          </div>
          <div className={styles.settingsForm}>
            <div className={`${styles.formGroup} ${styles.toggle}`}>
              <div className={styles.toggleInfo}>
                <label>Email Notifications</label>
                <p className={styles.formHelp}>Receive notifications via email</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={`${styles.formGroup} ${styles.toggle}`}>
              <div className={styles.toggleInfo}>
                <label>Low Stock Alerts</label>
                <p className={styles.formHelp}>Get alerted when items are running low</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.lowStockAlerts}
                  onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={`${styles.formGroup} ${styles.toggle}`}>
              <div className={styles.toggleInfo}>
                <label>Credit Reminders</label>
                <p className={styles.formHelp}>Reminders for overdue credits</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.creditReminders}
                  onChange={(e) => handleChange('creditReminders', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={`${styles.formGroup} ${styles.toggle}`}>
              <div className={styles.toggleInfo}>
                <label>Daily Reports</label>
                <p className={styles.formHelp}>Receive daily sales reports via email</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.dailyReports}
                  onChange={(e) => handleChange('dailyReports', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
