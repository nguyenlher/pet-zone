// src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  const config = {
    // Green (positive / ready / completed)
    AVAILABLE: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    COMPLETED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    DELIVERED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    PAID: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    ACTIVE: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    ONLINE: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },
    SUCCESS: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-300',
    },

    // Red (negative / out of stock / failed / cancelled)
    CANCELLED: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-300',
    },
    PAYMENT_FAILED: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-300',
    },
    OUT_OF_STOCK: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-300',
    },
    FAILED: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-300',
    },
    INACTIVE: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-300',
    },

    // Amber (pending / awaiting action)
    PENDING: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-300',
    },
    PENDING_PAYMENT: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-300',
    },
    QUEUED: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-300',
    },

    // Blue (in progress / shipping)
    PROCESSING: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-300',
    },
    SHIPPED: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-300',
    },
    CONFIRM: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-300',
    },
    RUNNING: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-300',
    },

    // Neutral (sold / archived / discontinued)
    SOLD: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-600',
      dot: 'bg-neutral-400',
      border: 'border-neutral-300',
    },
    DISCONTINUED: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-600',
      dot: 'bg-neutral-400',
      border: 'border-neutral-300',
    },
    RESERVED: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
      border: 'border-purple-300',
    },
    REFUNDED: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-600',
      dot: 'bg-neutral-400',
      border: 'border-neutral-300',
    },
  };

  const current = config[normalized] || {
    bg: 'bg-neutral-50',
    text: 'text-neutral-700',
    dot: 'bg-neutral-400',
    border: 'border-neutral-200',
  };

  const STATUS_LABELS = {
    // OrderStatus Enum
    PENDING_PAYMENT: 'Chờ thanh toán',
    PENDING: 'Chờ xử lý',
    CONFIRM: 'Đã xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao hàng',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy',
    PAYMENT_FAILED: 'Thanh toán thất bại',
    COMPLETED: 'Hoàn thành',
    PROCESSING: 'Đang xử lý',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền',

    // ProductStatus Enum
    AVAILABLE: 'Còn hàng',
    OUT_OF_STOCK: 'Hết hàng',
    DISCONTINUED: 'Ngừng kinh doanh',

    // PetStatus Enum
    SOLD: 'Đã bán',
    RESERVED: 'Đã giữ chỗ',

    // User/Customer status
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Đã tạm khóa',

    // General
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
    RUNNING: 'Đang chạy',
    ONLINE: 'Trực tuyến',
  };

  const displayLabel = STATUS_LABELS[normalized] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold border rounded-none ${current.bg} ${current.text} ${current.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {displayLabel}
    </span>
  );
}
