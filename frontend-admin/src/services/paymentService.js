// src/services/paymentService.js
import api from './api';

export const paymentService = {
  // Create payment
  createPayment: async (paymentData) => {
    const response = await api.post('/api/public/payments', paymentData);
    return response.data;
  },

  // Get all payments (admin endpoint - needs to be implemented in backend)
  getAllPayments: async (page = 0, size = 20, sort = 'createdAt,desc') => {
    const response = await api.get('/api/private/payments', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/api/private/payments/${paymentId}`);
    return response.data;
  },

  // Get payments by order ID
  getPaymentsByOrderId: async (orderId) => {
    const response = await api.get(`/api/private/payments/order/${orderId}`);
    return response.data;
  },

  // Get payments by user ID
  getPaymentsByUserId: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/api/private/payments/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get payments by status
  getPaymentsByStatus: async (status, page = 0, size = 20) => {
    const response = await api.get(`/api/private/payments/status/${status}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get payment statistics
  getPaymentStatistics: async (startDate, endDate) => {
    const response = await api.get('/api/private/payments/statistics', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
