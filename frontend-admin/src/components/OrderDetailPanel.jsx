// src/components/OrderDetailPanel.jsx
import { X, Mail, Phone, MessageCircle, Target, RotateCcw } from 'lucide-react';
import StatusBadge from './StatusBadge';
export default function OrderDetailPanel({ order, onClose }) {
  if (!order) return null;

  const total = order.totalAmount || 0;

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
            <h3 className="text-base font-bold text-gray-900">Order {order.orderId ? order.orderId.substring(0, 8) : 'N/A'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={order.orderStatus} />
              <span className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
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
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{ background: '#10b981' }}
              >
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">User</p>
                <p className="text-xs text-gray-400">Regular Customer</p>
              </div>
            </div>

            {/* Contact icons */}
            <div className="flex items-center gap-2 mt-3">
              <button className="flex-1 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-150 cursor-pointer">
                <Mail size={15} />
              </button>
              <button className="flex-1 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-150 cursor-pointer">
                <Phone size={15} />
              </button>
              <button className="flex-1 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-all duration-150 cursor-pointer">
                <MessageCircle size={15} />
              </button>
            </div>
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
                    <p className="text-xs text-gray-400">{item.quantity} item(s)</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${item.subtotalPrice ? item.subtotalPrice.toFixed(2) : '0.00'}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <hr className="my-4 border-gray-100" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total</span>
              <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 border-t border-gray-100 flex flex-col gap-2">
          <button className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
            <Target size={16} />
            Track Order
          </button>
          <button className="w-full h-11 rounded-xl text-gray-900 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-150 cursor-pointer" style={{ background: '#F59E0B' }}>
            <RotateCcw size={16} />
            Refund
          </button>
        </div>
      </div>
    </>
  );
}
