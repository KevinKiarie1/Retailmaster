'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { inventoryAPI } from '@/services/api';
import { Product } from '@/types';
import styles from './page.module.css';

const defaultProducts: Product[] = [
  { id: 1, name: 'Product 1', sku: 'SKU001', category: 'Electronics', unit_price: 1500, cost_price: 1000, quantity_in_stock: 25, low_stock_threshold: 10, status: 'active', description: null, created_at: '', updated_at: '' },
  { id: 2, name: 'Product 2', sku: 'SKU002', category: 'Clothing', unit_price: 800, cost_price: 500, quantity_in_stock: 5, low_stock_threshold: 10, status: 'active', description: null, created_at: '', updated_at: '' },
  { id: 3, name: 'Product 3', sku: 'SKU003', category: 'Food', unit_price: 250, cost_price: 150, quantity_in_stock: 100, low_stock_threshold: 20, status: 'active', description: null, created_at: '', updated_at: '' },
];

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await inventoryAPI.getAll();
      if (response.data?.success && response.data.data) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.log('Using demo data');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (product: Product): boolean => {
    return product.quantity_in_stock <= product.low_stock_threshold;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Inventory</h1>
          <p className={styles.pageSubtitle}>Manage your products and stock levels</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <div className={styles.pageToolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productName}>
                    <Package size={18} className={styles.productIcon} />
                    {product.name}
                  </div>
                </td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>KSh {product.unit_price.toLocaleString()}</td>
                <td>
                  <div className={`${styles.stockBadge} ${isLowStock(product) ? styles.low : styles.normal}`}>
                    {isLowStock(product) && <AlertTriangle size={14} />}
                    {product.quantity_in_stock}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.btnIcon} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className={`${styles.btnIcon} ${styles.danger}`} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
