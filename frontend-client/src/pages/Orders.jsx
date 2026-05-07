import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import '../styles/pages/Orders.css';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAllOrders(page, 10);
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId, 'Customer requested cancellation');
      fetchOrders(); // Refresh orders list
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={18} className="status-icon pending" />;
      case 'CONFIRM':
        return <CheckCircle size={18} className="status-icon confirm" />;
      case 'SHIPPED':
        return <Truck size={18} className="status-icon shipped" />;
      case 'DELIVERED':
        return <CheckCircle size={18} className="status-icon delivered" />;
      case 'CANCELLED':
        return <XCircle size={18} className="status-icon cancelled" />;
      default:
        return <Package size={18} className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="empty-state">
            <h3>Please log in to view your orders</h3>
            <Link to="/login" className="btn btn-primary">Log In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Package size={32} />
            My Orders
          </h1>
          <p className="page-subtitle">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} className="empty-icon" />
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <motion.div
                  key={order.orderId}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-id">Order #{order.orderId.slice(0, 8)}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`status-text ${order.orderStatus.toLowerCase()}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <span className="item-price">${item.subtotalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${order.subtotalAmount.toLocaleString()}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount:</span>
                        <span>-${order.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {order.shippingFee > 0 && (
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>${order.shippingFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {order.orderStatus === 'PENDING' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order.orderId)}
                      >
                        <XCircle size={16} />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="modal-header">
                <h2>Order Details</h2>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h4>Order Information</h4>
                  <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedOrder.orderStatus)}</p>
                  <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  {selectedOrder.updatedAt && (
                    <p><strong>Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Items</h4>
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <div key={index} className="detail-item">
                      <div>
                        <p><strong>{item.name}</strong></p>
                        <p>Quantity: {item.quantity} × ${item.price.toLocaleString()}</p>
                      </div>
                      <p className="detail-item-price">${item.subtotalPrice.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="detail-section">
                  <h4>Payment Summary</h4>
                  <div className="detail-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotalAmount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="summary-row">
                        <span>Discount:</span>
                        <span>-${selectedOrder.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.shippingFee > 0 && (
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>${selectedOrder.shippingFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
