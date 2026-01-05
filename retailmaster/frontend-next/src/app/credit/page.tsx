'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { creditsAPI } from '@/services/api';
import { Credit, CreditStatus } from '@/types';
import styles from './page.module.css';

const defaultCredits: Credit[] = [
  { id: 1, customer_id: 1, customer_name: 'John Doe', customer_phone: '0712345678', amount: 5000, balance: 3000, due_date: '2025-12-15', status: 'partial', sale_id: null, notes: null, created_at: '', updated_at: '' },
  { id: 2, customer_id: 2, customer_name: 'Jane Smith', customer_phone: '0723456789', amount: 8000, balance: 8000, due_date: '2025-12-01', status: 'active', sale_id: null, notes: null, created_at: '', updated_at: '' },
  { id: 3, customer_id: 3, customer_name: 'Mike Johnson', customer_phone: '0734567890', amount: 2500, balance: 0, due_date: '2025-11-20', status: 'paid', sale_id: null, notes: null, created_at: '', updated_at: '' },
  { id: 4, customer_id: 4, customer_name: 'Sarah Wilson', customer_phone: '0745678901', amount: 4200, balance: 4200, due_date: '2025-11-15', status: 'overdue', sale_id: null, notes: null, created_at: '', updated_at: '' },
];

type FilterStatus = 'all' | CreditStatus;

export default function CreditPage() {
  const [credits, setCredits] = useState<Credit[]>(defaultCredits);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async (): Promise<void> => {
    try {
      const response = await creditsAPI.getAll();
      if (response.data?.success && response.data.data) {
        setCredits(response.data.data);
      }
    } catch (error) {
      console.log('Using demo data');
    }
  };

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.customer_phone.includes(searchTerm);
    const matchesFilter = filter === 'all' || credit.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: CreditStatus): React.ReactNode => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const totalActive = credits.filter(c => c.status !== 'paid').reduce((sum, c) => sum + c.balance, 0);

  const filterOptions: FilterStatus[] = ['all', 'active', 'partial', 'overdue', 'paid'];

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Credit Management</h1>
          <p className={styles.pageSubtitle}>Track and manage customer credits</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} />
          New Credit
        </button>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Total Active Credits</h3>
          <p className={styles.summaryValue}>KSh {totalActive.toLocaleString()}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Credits with Balance</h3>
          <p className={styles.summaryValue}>{credits.filter(c => c.balance > 0).length}</p>
        </div>
        <div className={`${styles.summaryCard} ${styles.warning}`}>
          <h3>Overdue</h3>
          <p className={styles.summaryValue}>{credits.filter(c => c.status === 'overdue').length}</p>
        </div>
      </div>

      <div className={styles.pageToolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterButtons}>
          {filterOptions.map((status) => (
            <button
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCredits.map((credit) => (
              <tr key={credit.id}>
                <td>
                  <div className={styles.customerName}>
                    <CreditCard size={18} className={styles.customerIcon} />
                    {credit.customer_name}
                  </div>
                </td>
                <td>{credit.customer_phone}</td>
                <td>KSh {credit.amount.toLocaleString()}</td>
                <td className={credit.balance > 0 ? styles.textRed : styles.textGreen}>
                  KSh {credit.balance.toLocaleString()}
                </td>
                <td>{credit.due_date}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[credit.status]}`}>
                    {getStatusIcon(credit.status)}
                    {credit.status}
                  </span>
                </td>
                <td>
                  <button className={`${styles.btn} ${styles.btnSmall}`}>Record Payment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
