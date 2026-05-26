// src/services/productService.js
import api from './api';

export const productService = {
  // Get all products with pagination
  getProducts: async (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC') => {
    const response = await api.get('/api/public/products', {
      params: { page, size, sortBy, sortDirection },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/public/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, page = 0, size = 10) => {
    const response = await api.get(`/api/public/products/category/${category}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get products by pet type
  getProductsByPetType: async (petTypeId, page = 0, size = 10) => {
    const response = await api.get(`/api/public/products/pet-type/${petTypeId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Search products
  searchProducts: async (keyword, page = 0, size = 10) => {
    const response = await api.get('/api/public/products/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  // Get top selling products
  getTopSellingProducts: async (limit = 10) => {
    const response = await api.get('/api/public/products/top-selling', {
      params: { limit },
    });
    return response.data;
  },

  // Get top rated products
  getTopRatedProducts: async (limit = 10) => {
    const response = await api.get('/api/public/products/top-rated', {
      params: { limit },
    });
    return response.data;
  },

  // Admin endpoints
  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/api/public/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/public/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/public/products/${id}`);
    return response.data;
  },

  // Increment view count
  incrementViewCount: async (id) => {
    const response = await api.post(`/api/public/products/${id}/view`);
    return response.data;
  },
};
