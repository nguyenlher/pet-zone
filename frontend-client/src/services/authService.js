import api from './api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const authService = {

  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('token_type', response.data.token_type);
      localStorage.setItem('expires_in', response.data.expires_in);
    }
    
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await api.post(`${API_BASE_URL}/api/auth/logout?refreshToken=${refreshToken}`);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('user');
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post(`${API_BASE_URL}/api/auth/refresh?refreshToken=${refreshToken}`);
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('token_type', response.data.token_type);
      localStorage.setItem('expires_in', response.data.expires_in);
    }
    
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get(`${API_BASE_URL}/api/me/profile`);
    return response.data;
  },

  async updateProfile(updates) {
    const response = await api.put(`${API_BASE_URL}/api/me/profile`, updates);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
      email
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  async resetPassword(keycloakId, newPassword) {
    const response = await api.post(`${API_BASE_URL}/api/auth/reset-password/${keycloakId}`, {
      newPassword
    });
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
    },

  getAccessToken() {
    return localStorage.getItem('token');
  }
};

export default authService;
