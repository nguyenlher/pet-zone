// src/services/orderService.js
import api from './api';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/api/public/order/create', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    const response = await api.post('/api/public/order/cancel', {
      orderId,
      reason,
    });
    return response.data;
  },

  // Get all orders (admin endpoint - needs to be implemented in backend)
  getAllOrders: async (page = 0, size = 20, sort = 'createdAt,desc') => {
    const response = await api.get('/api/public/order', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/private/orders/${orderId}`);
    return response.data;
  },

  // Get orders by user ID
  getOrdersByUserId: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/api/private/orders/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get orders by status
  getOrdersByStatus: async (status, page = 0, size = 20) => {
    const response = await api.get(`/api/private/orders/status/${status}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/api/private/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  // Delete order (admin) - Only for CANCELLED or PAYMENT_FAILED
  deleteOrder: async (orderId) => {
    const response = await api.delete(`/api/private/orders/${orderId}`);
    return response.data;
  },
};
