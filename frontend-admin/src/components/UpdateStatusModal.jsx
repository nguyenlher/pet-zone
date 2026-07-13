// src/components/UpdateStatusModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán', dot: 'bg-amber-500', activeClass: 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500' },
  { value: 'PENDING', label: 'Chờ xử lý', dot: 'bg-amber-500', activeClass: 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500' },
  { value: 'CONFIRM', label: 'Đã xác nhận', dot: 'bg-blue-500', activeClass: 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500' },
  { value: 'SHIPPED', label: 'Đang giao hàng', dot: 'bg-blue-500', activeClass: 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500' },
  { value: 'DELIVERED', label: 'Đã giao hàng', dot: 'bg-emerald-500', activeClass: 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-600' },
  { value: 'CANCELLED', label: 'Đã hủy', dot: 'bg-red-500', activeClass: 'border-red-500 bg-red-50 text-red-800 font-bold ring-1 ring-red-500' },
  { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại', dot: 'bg-red-500', activeClass: 'border-red-500 bg-red-50 text-red-800 font-bold ring-1 ring-red-500' },
];

export default function UpdateStatusModal({ order, onClose, onSubmit }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || 'PENDING');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(selectedStatus);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Cập nhật trạng thái đơn hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-none border border-neutral-200 shadow-2xl z-50 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">Cập nhật trạng thái đơn hàng</h3>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              ĐƠN HÀNG #{order.orderId?.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Chọn trạng thái tiến trình
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-3 py-2.5 rounded-none border text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    selectedStatus === status.value
                      ? status.activeClass
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-black'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-none text-xs font-bold uppercase tracking-wider text-neutral-700 hover:border-black transition-colors cursor-pointer bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedStatus === order.orderStatus}
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu trạng thái'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
