// src/constants/orderFilters.js

export const ORDER_STATUSES = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRM', label: 'Đã xác nhận' },
  { value: 'SHIPPED', label: 'Đang giao hàng' },
  { value: 'DELIVERED', label: 'Đã giao hàng' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại' },
];
