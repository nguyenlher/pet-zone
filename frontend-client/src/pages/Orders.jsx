import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  CONFIRM: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Confirmed' },
  SHIPPED: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { if (user) fetchOrders(); }, [user, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true); setError(null);
      const response = await orderService.getUserOrders(page, 10);
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId, 'Customer requested cancellation');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  if (!user) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center"><h3 className="font-heading text-xl font-bold text-stone-700 mb-4">Please log in to view your orders</h3>
        <Link to="/login" className="btn btn-primary">Log In</Link></div>
    </div>
  );

  if (loading) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center"><div className="spinner mx-auto mb-4" /><p className="text-stone-500">Loading your orders...</p></div>
    </div>
  );

  if (error) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center"><p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchOrders} className="btn btn-primary">Try Again</button></div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Package size={32} className="text-primary" />
          <h1 className="font-heading text-4xl font-bold text-stone-900">My Orders</h1>
        </div>
        <p className="text-stone-500 mb-8">Track and manage your orders</p>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Package size={64} strokeWidth={1} className="mb-5" />
            <h3 className="font-heading text-2xl font-bold text-stone-700 mb-2">No orders yet</h3>
            <p className="text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {orders.map((order) => {
                const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div key={order.orderId} className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-stone-900">Order #{order.orderId.slice(0, 8)}</h3>
                        <p className="text-sm text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon size={13} /> {cfg.label}
                      </span>
                    </div>

                    <div className="bg-stone-50 rounded-xl divide-y divide-stone-100 mb-4">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center px-4 py-3">
                          <div>
                            <span className="text-sm font-medium text-stone-800">{item.name}</span>
                            <span className="text-xs text-stone-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="text-sm font-semibold text-stone-900">${item.subtotalPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-stone-600">
                        Total: <span className="font-heading font-bold text-stone-900 text-base">${order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(order)}>
                          <Eye size={14} /> View Details
                        </button>
                        {order.orderStatus === 'PENDING' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancelOrder(order.orderId)}>
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
                <span className="text-sm text-stone-600">Page {page + 1} of {totalPages}</span>
                <button className="btn btn-secondary" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-heading text-xl font-bold text-stone-900">Order Details</h2>
              <button className="text-stone-400 hover:text-stone-700 transition-colors" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <h4 className="text-sm font-semibold text-stone-700 mb-2">Order Information</h4>
                <p className="text-sm text-stone-600"><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p className="text-sm text-stone-600"><strong>Status:</strong> {STATUS_CONFIG[selectedOrder.orderStatus]?.label || selectedOrder.orderStatus}</p>
                <p className="text-sm text-stone-600"><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-700 mb-3">Items</h4>
                <div className="bg-stone-50 rounded-xl divide-y divide-stone-100">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold">${item.subtotalPrice.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-stone-600"><span>Subtotal:</span><span>${selectedOrder.subtotalAmount.toLocaleString()}</span></div>
                {selectedOrder.discountAmount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Discount:</span><span>-${selectedOrder.discountAmount.toLocaleString()}</span></div>}
                {selectedOrder.shippingFee > 0 && <div className="flex justify-between text-sm text-stone-600"><span>Shipping:</span><span>${selectedOrder.shippingFee.toLocaleString()}</span></div>}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-heading font-bold text-stone-900"><span>Total:</span><span>${selectedOrder.totalAmount.toLocaleString()}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
