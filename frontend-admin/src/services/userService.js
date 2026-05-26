// src/services/userService.js
import api from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async (page = 0, size = 20, sort = 'createdAt,desc') => {
    const response = await api.get('/api/public/users/all', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    const response = await api.get(`/api/public/users/${userId}`);
    return response.data;
  },

  // Search users (admin only)
  searchUsers: async (keyword, page = 0, size = 20) => {
    const response = await api.get('/api/public/users/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  // Create user (admin only)
  createUser: async (userData) => {
    const response = await api.post(`/api/auth/register`, userData);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/public/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/public/users/${userId}`);
    return response.data;
  },

  // Get user statistics (admin only)
  getUserStatistics: async () => {
    const response = await api.get('/api/public/users/summary');
    return response.data;
  },

  // Get current user's profile (authenticated user)
  getProfile: async () => {
    const response = await api.get('/api/me/profile');
    return response.data;
  },

  // Get user's shipping addresses
  getUserShippingAddresses: async (userId) => {
    const response = await api.get(`/api/public/users/${userId}/shipping-info`);
    return response.data;
  },

  // Get user's favorites
  getUserFavorites: async (userId) => {
    const response = await api.get(`/api/public/users/${userId}/favorites`);
    return response.data;
  },
};

