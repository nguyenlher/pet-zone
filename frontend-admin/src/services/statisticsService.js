// src/services/statisticsService.js
import api from './api';

export const statisticsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/api/statistics/dashboard');
    return response.data;
  },

  // Get revenue statistics
  getRevenueStats: async (startDate, endDate, groupBy = 'day') => {
    const response = await api.get('/api/statistics/revenue', {
      params: { startDate, endDate, groupBy },
    });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (startDate, endDate) => {
    const response = await api.get('/api/statistics/orders', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get customer statistics
  getCustomerStats: async () => {
    const response = await api.get('/api/statistics/customers');
    return response.data;
  },

  // Get top selling pets
  getTopSellingPets: async (limit = 5, startDate, endDate) => {
    const response = await api.get('/api/statistics/top-pets', {
      params: { limit, startDate, endDate },
    });
    return response.data;
  },

  // Get top selling products
  getTopSellingProducts: async (limit = 5, startDate, endDate) => {
    const response = await api.get('/api/statistics/top-products', {
      params: { limit, startDate, endDate },
    });
    return response.data;
  },

  // Get sales chart data
  getSalesChartData: async (startDate, endDate) => {
    const response = await api.get('/api/statistics/sales-chart', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get payment method statistics
  getPaymentMethodStats: async (startDate, endDate) => {
    const response = await api.get('/api/statistics/payment-methods', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
