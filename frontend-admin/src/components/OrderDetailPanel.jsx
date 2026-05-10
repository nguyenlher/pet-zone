// src/components/OrderDetailPanel.jsx
import { X, Mail, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function OrderDetailPanel({ order, onClose, onUpdateStatus, onDelete }) {
  if (!order) return null;

  const total = order.totalAmount || 0;
  const subtotal = order.subtotalAmount || 0;
  const discount = order.discountAmount || 0;
  const shipping = order.shippingFee || 0;

  const canDelete = order.orderStatus === 'CANCELLED' || order.orderStatus === 'PAYMENT_FAILED';

  const handleEdit = () => {
    onUpdateStatus(order);
  };

  const handleDelete = () => {
    if (!canDelete) {
      alert('Only orders with status CANCELLED or PAYMENT_FAILED can be deleted');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete order #${order.orderId.substring(0, 8).toUpperCase()}?`)) {
      onDelete(order.orderId);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Order #{order.orderId ? order.orderId.substring(0, 8).toUpperCase() : 'N/A'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={order.orderStatus} />
              <span className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Customer */}
          <div className="p-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</p>
            <div className="flex items-center gap-3">
              {order.user ? (
                <>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ 
                      background: ['#F87171', '#60A5FA', '#34D399', '#A78BFA', '#FB923C', '#F472B6'][
                        Math.abs(order.user.id?.charCodeAt(0) || 0) % 6
                      ]
                    }}
                  >
                    {`${order.user.firstName?.[0] || ''}${order.user.lastName?.[0] || ''}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{order.user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ background: '#9CA3AF' }}
                  >
                    ?
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Unknown User</p>
                    <p className="text-xs text-gray-400">No information available</p>
                  </div>
                </>
              )}
            </div>

            {/* Contact */}
            {order.user && (
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={`mailto:${order.user.email}`}
                  className="flex-1 h-9 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-150 cursor-pointer"
                  title={`Email: ${order.user.email}`}
                >
                  <Mail size={15} />
                  <span className="text-xs font-medium">Email</span>
                </a>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
            <div className="flex flex-col gap-3">
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gray-100"
                  >
                    <svg viewBox="0 0 32 20" className="w-8 h-6" fill="none">
                      <path d="M4 14 Q6 7 11 6 L21 5 Q26 5 27 9 Q28 12 26 14 Z" fill="#9ca3af" opacity="0.7" />
                      <path d="M4 14 Q6 15.5 26 14 Q27 15 4 15 Z" fill="#9ca3af" opacity="0.9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.quantity} item(s) × {formatVND(item.price || 0)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatVND(item.subtotalPrice || 0)}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <hr className="my-4 border-gray-100" />

            {/* Price breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className={`font-medium ${discount > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {discount > 0 ? `-${formatVND(discount)}` : formatVND(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping Fee</span>
                <span className="font-medium text-gray-900">{formatVND(shipping)}</span>
              </div>
            </div>

            {/* Separator */}
            <hr className="my-4 border-gray-100" />

            {/* Total */}
            <div className="flex items-center justify-between bg-gray-50 -mx-5 px-5 py-3 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">Total Amount</span>
              <span className="text-xl font-bold text-emerald-600">{formatVND(total)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 border-t border-gray-100 flex flex-col gap-2">
          <button 
            onClick={handleEdit}
            className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors duration-150 cursor-pointer"
          >
            <Edit size={16} />
            Edit Status
          </button>
          <button 
            onClick={handleDelete}
            disabled={!canDelete}
            className={`w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
              canDelete
                ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={!canDelete ? 'Only CANCELLED or PAYMENT_FAILED orders can be deleted' : 'Delete this order'}
          >
            <Trash2 size={16} />
            Delete Order
          </button>
        </div>
      </div>
    </>
  );
}
