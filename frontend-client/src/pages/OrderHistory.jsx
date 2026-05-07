import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, Search, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/pages/OrderHistory.css';

const sampleOrders = [
  {
    id: 'ORD-2024-001', date: '2024-12-15', status: 'Delivered', total: 885,
    items: [
      { id: 1, name: 'Buddy - Golden Retriever', price: 850, quantity: 1, image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=100&h=100&fit=crop' },
      { id: 101, name: 'Premium Dog Food (5kg)', price: 35, quantity: 1, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop' },
    ],
    shipping: { name: 'Sarah Johnson', address: '123 Pet Street, New York, NY 10001', phone: '+1 234 567 8900' },
    payment: 'Credit Card (**** 4242)',
  },
];

const statusColors = {
  'Pending': 'badge-warning',
  'Processing': 'badge-info',
  'Shipped': 'badge-primary',
  'Delivered': 'badge-success',
};

export default function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = sampleOrders.filter(order => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="orders-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title">Order History</h1>
          <p className="page-subtitle">{sampleOrders.length} total orders</p>
        </motion.div>

        <div className="orders-controls">
          <div className="search-bar orders-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filters">
            {['all', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(s => (
              <button
                key={s}
                className={`category-tab ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                className="order-card card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="order-main-info">
                    <div className="order-id-row">
                      <Package size={18} />
                      <strong>{order.id}</strong>
                    </div>
                    <div className="order-meta">
                      <span><Calendar size={14} /> {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span className="order-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="order-right">
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    <span className="order-total">${order.total.toLocaleString()}</span>
                    {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details animate-slide-down">
                    <div className="order-items-list">
                      <h4>Items</h4>
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item-info">
                            <strong>{item.name}</strong>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <span className="order-item-price">${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-extra-grid">
                      <div className="order-extra-card">
                        <h4>Shipping Details</h4>
                        <p>{order.shipping.name}</p>
                        <p>{order.shipping.address}</p>
                        <p>{order.shipping.phone}</p>
                      </div>
                      <div className="order-extra-card">
                        <h4>Payment</h4>
                        <p>{order.payment}</p>
                        <p className="order-total-label">Total: <strong>${order.total.toLocaleString()}</strong></p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="empty-state">
              <Package size={48} />
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
