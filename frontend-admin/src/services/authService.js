// src/services/authService.js
import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await api.post('/api/auth/logout', null, {
      params: { refreshToken },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (keycloakId, newPassword) => {
    const response = await api.post(`/api/auth/reset-password/${keycloakId}`, {
      newPassword,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/api/auth/refresh', null, {
      params: { refreshToken },
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/api/me/profile');
    return response.data;
  },
};
