'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Search, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from 'lucide-react';
import { mpesaAPI } from '@/services/api';
import { MpesaTransaction, MpesaStats } from '@/types';
import styles from './page.module.css';

const defaultTransactions: MpesaTransaction[] = [
  { id: 1, transaction_id: 'QHB12345KL', phone_number: '0712345678', amount: 1500, transaction_type: 'payment', status: 'completed', transaction_date: '2025-11-30 10:30:00', reference: null, sale_id: null, credit_payment_id: null, created_at: '' },
  { id: 2, transaction_id: 'QHB12346KL', phone_number: '0723456789', amount: 3000, transaction_type: 'payment', status: 'completed', transaction_date: '2025-11-30 09:15:00', reference: null, sale_id: null, credit_payment_id: null, created_at: '' },
  { id: 3, transaction_id: 'QHB12347KL', phone_number: '0734567890', amount: 500, transaction_type: 'payment', status: 'failed', transaction_date: '2025-11-30 08:45:00', reference: null, sale_id: null, credit_payment_id: null, created_at: '' },
];

const defaultStats: MpesaStats = {
  today: { count: 3, total: 5000 },
  this_month: { count: 45, total: 125000 }
};

export default function MPesa() {
  const [transactions, setTransactions] = useState<MpesaTransaction[]>(defaultTransactions);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stats, setStats] = useState<MpesaStats>(defaultStats);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const [transRes, statsRes] = await Promise.all([
        mpesaAPI.getToday(),
        mpesaAPI.getStats()
      ]);
      
      if (transRes.data?.success && transRes.data.data) {
        setTransactions(transRes.data.data);
      }
      if (statsRes.data?.success && statsRes.data.data) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.log('Using demo data');
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone_number.includes(searchTerm)
  );

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>M-Pesa Transactions</h1>
          <p className={styles.pageSubtitle}>Track mobile money transactions</p>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.green}`}>
            <Smartphone size={24} />
          </div>
          <div>
            <h3>Today&apos;s Transactions</h3>
            <p className={styles.summaryValue}>{stats.today.count}</p>
            <p className={styles.summarySub}>KSh {stats.today.total.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.blue}`}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h3>This Month</h3>
            <p className={styles.summaryValue}>{stats.this_month.count}</p>
            <p className={styles.summarySub}>KSh {stats.this_month.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className={styles.pageToolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Phone Number</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td className={styles.mono}>{t.transaction_id}</td>
                <td>{t.phone_number}</td>
                <td className={styles.textGreen}>KSh {t.amount.toLocaleString()}</td>
                <td>
                  <span className={`${styles.typeBadge} ${styles[t.transaction_type]}`}>
                    {t.transaction_type === 'payment' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {t.transaction_type}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[t.status]}`}>
                    {t.status === 'completed' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {t.status}
                  </span>
                </td>
                <td>{new Date(t.transaction_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
