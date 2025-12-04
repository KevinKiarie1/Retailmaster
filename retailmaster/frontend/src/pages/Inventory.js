import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { inventoryAPI } from '../services/api';
import './PageStyles.css';

const Inventory = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', sku: 'SKU001', category: 'Electronics', unit_price: 1500, quantity_in_stock: 25, low_stock_threshold: 10, status: 'active' },
    { id: 2, name: 'Product 2', sku: 'SKU002', category: 'Clothing', unit_price: 800, quantity_in_stock: 5, low_stock_threshold: 10, status: 'active' },
    { id: 3, name: 'Product 3', sku: 'SKU003', category: 'Food', unit_price: 250, quantity_in_stock: 100, low_stock_threshold: 20, status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await inventoryAPI.getAll();
      if (response.data?.success) {
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

  const isLowStock = (product) => {
    return product.quantity_in_stock <= product.low_stock_threshold;
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Inventory</h1>
          <p className="page-subtitle">Manage your products and stock levels</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
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
                  <div className="product-name">
                    <Package size={18} className="product-icon" />
                    {product.name}
                  </div>
                </td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>KSh {product.unit_price.toLocaleString()}</td>
                <td>
                  <div className={`stock-badge ${isLowStock(product) ? 'low' : 'normal'}`}>
                    {isLowStock(product) && <AlertTriangle size={14} />}
                    {product.quantity_in_stock}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon danger" title="Delete">
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
};

export default Inventory;
