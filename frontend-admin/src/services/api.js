// src/services/api.js
import axios from 'axios';
import { isTokenExpired, isAdmin } from '../utils/jwtUtils';

// Use relative path to leverage Vite proxy (no baseURL needed)
// This allows the app to work with both localhost and ngrok
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Skip auth checks for public endpoints
    const publicEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (isPublicEndpoint) {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            '/api/auth/refresh',
            null,
            { params: { refreshToken } }
          );
          
          const { access_token } = response.data;
          
          if (isAdmin(access_token)) {
            localStorage.setItem('accessToken', access_token);
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
