import React, { useState, useEffect } from 'react';
import { Smartphone, Search, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from 'lucide-react';
import { mpesaAPI } from '../services/api';
import './PageStyles.css';

const MPesa = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, transaction_id: 'QHB12345KL', phone_number: '0712345678', amount: 1500, transaction_type: 'payment', status: 'completed', transaction_date: '2025-11-30 10:30:00' },
    { id: 2, transaction_id: 'QHB12346KL', phone_number: '0723456789', amount: 3000, transaction_type: 'payment', status: 'completed', transaction_date: '2025-11-30 09:15:00' },
    { id: 3, transaction_id: 'QHB12347KL', phone_number: '0734567890', amount: 500, transaction_type: 'payment', status: 'failed', transaction_date: '2025-11-30 08:45:00' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    today: { count: 3, total: 5000 },
    this_month: { count: 45, total: 125000 }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, statsRes] = await Promise.all([
        mpesaAPI.getToday(),
        mpesaAPI.getStats()
      ]);
      
      if (transRes.data?.success) {
        setTransactions(transRes.data.data);
      }
      if (statsRes.data?.success) {
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
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>M-Pesa Transactions</h1>
          <p className="page-subtitle">Track mobile money transactions</p>
        </div>
      </header>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon green">
            <Smartphone size={24} />
          </div>
          <div>
            <h3>Today's Transactions</h3>
            <p className="summary-value">{stats.today.count}</p>
            <p className="summary-sub">KSh {stats.today.total.toLocaleString()}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon blue">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h3>This Month</h3>
            <p className="summary-value">{stats.this_month.count}</p>
            <p className="summary-sub">KSh {stats.this_month.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
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
                <td className="mono">{t.transaction_id}</td>
                <td>{t.phone_number}</td>
                <td className="text-green">KSh {t.amount.toLocaleString()}</td>
                <td>
                  <span className={`type-badge ${t.transaction_type}`}>
                    {t.transaction_type === 'payment' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {t.transaction_type}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${t.status}`}>
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
};

export default MPesa;
