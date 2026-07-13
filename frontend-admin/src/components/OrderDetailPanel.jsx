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

  const orderId = order.orderId || order.id;
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
      alert('Chỉ đơn hàng có trạng thái ĐÃ HỦY hoặc THANH TOÁN THẤT BẠI mới có thể xóa');
      return;
    }
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId ? orderId.substring(0, 8).toUpperCase() : ''}?`)) {
      onDelete(orderId);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-white">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-mono">
              ĐƠN HÀNG #{orderId ? orderId.substring(0, 8).toUpperCase() : 'N/A'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={order.orderStatus} />
              <span className="text-xs text-neutral-500 tabular-nums">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '—'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer bg-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Customer */}
          <div className="p-5 border-b border-neutral-200">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Thông tin khách hàng</p>
            <div className="flex items-center gap-3">
              {order.user ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {`${order.user.firstName?.[0] || ''}${order.user.lastName?.[0] || ''}`.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {order.user.firstName || ''} {order.user.lastName || ''}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{order.user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-medium flex-shrink-0">
                    ?
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">Khách vãng lai</p>
                    <p className="text-xs text-neutral-500">Chưa liên kết tài khoản</p>
                  </div>
                </>
              )}
            </div>

            {/* Contact */}
            {order.user && (
              <div className="flex items-center gap-2 mt-3.5">
                <a
                  href={`mailto:${order.user.email}`}
                  className="flex-1 h-8 rounded-md border border-neutral-200 flex items-center justify-center gap-2 text-neutral-700 hover:text-black hover:border-neutral-400 transition-colors cursor-pointer bg-white text-xs font-medium shadow-sm"
                  title={`Email: ${order.user.email}`}
                >
                  <Mail size={14} />
                  <span>Gửi email</span>
                </a>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="p-5">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Sản phẩm trong đơn</p>
            <div className="flex flex-col gap-2.5">
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-neutral-500 tabular-nums mt-0.5">
                      Số lượng: {item.quantity} × {formatVND(item.price || 0)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 tabular-nums">{formatVND(item.subtotalPrice || 0)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Tạm tính</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatVND(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Giảm giá</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {discount > 0 ? `-${formatVND(discount)}` : formatVND(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Phí vận chuyển</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatVND(shipping)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between bg-neutral-900 text-white p-3.5 rounded-lg">
              <span className="text-xs font-medium">Tổng thanh toán</span>
              <span className="text-base font-bold tabular-nums">{formatVND(total)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 border-t border-neutral-200 flex flex-col gap-2 bg-neutral-50/50">
          <button 
            onClick={handleEdit}
            className="w-full py-2.5 bg-neutral-900 text-white text-xs font-medium rounded-md flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Edit size={14} />
            Cập nhật trạng thái
          </button>
          <button 
            onClick={handleDelete}
            disabled={!canDelete}
            className={`w-full py-2.5 text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-colors border ${
              canDelete
                ? 'border-red-300 text-red-600 bg-white hover:bg-red-50 cursor-pointer shadow-sm'
                : 'border-neutral-200 text-neutral-300 bg-neutral-100 cursor-not-allowed'
            }`}
            title={!canDelete ? 'Chỉ đơn hàng CANCELLED hoặc PAYMENT_FAILED mới có thể xoá' : 'Xoá đơn hàng này'}
          >
            <Trash2 size={14} />
            Xoá đơn hàng
          </button>
        </div>
      </div>
    </>
  );
}
