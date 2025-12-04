import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { creditsAPI } from '../services/api';
import './PageStyles.css';

const Credit = () => {
  const [credits, setCredits] = useState([
    { id: 1, customer_name: 'John Doe', customer_phone: '0712345678', amount: 5000, balance: 3000, due_date: '2025-12-15', status: 'partial' },
    { id: 2, customer_name: 'Jane Smith', customer_phone: '0723456789', amount: 8000, balance: 8000, due_date: '2025-12-01', status: 'active' },
    { id: 3, customer_name: 'Mike Johnson', customer_phone: '0734567890', amount: 2500, balance: 0, due_date: '2025-11-20', status: 'paid' },
    { id: 4, customer_name: 'Sarah Wilson', customer_phone: '0745678901', amount: 4200, balance: 4200, due_date: '2025-11-15', status: 'overdue' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await creditsAPI.getAll();
      if (response.data?.success) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const totalActive = credits.filter(c => c.status !== 'paid').reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Credit Management</h1>
          <p className="page-subtitle">Track and manage customer credits</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          New Credit
        </button>
      </header>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Active Credits</h3>
          <p className="summary-value">KSh {totalActive.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Credits with Balance</h3>
          <p className="summary-value">{credits.filter(c => c.balance > 0).length}</p>
        </div>
        <div className="summary-card warning">
          <h3>Overdue</h3>
          <p className="summary-value">{credits.filter(c => c.status === 'overdue').length}</p>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {['all', 'active', 'partial', 'overdue', 'paid'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
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
                  <div className="customer-name">
                    <CreditCard size={18} className="customer-icon" />
                    {credit.customer_name}
                  </div>
                </td>
                <td>{credit.customer_phone}</td>
                <td>KSh {credit.amount.toLocaleString()}</td>
                <td className={credit.balance > 0 ? 'text-red' : 'text-green'}>
                  KSh {credit.balance.toLocaleString()}
                </td>
                <td>{credit.due_date}</td>
                <td>
                  <span className={`status-badge ${credit.status}`}>
                    {getStatusIcon(credit.status)}
                    {credit.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-small">Record Payment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Credit;
