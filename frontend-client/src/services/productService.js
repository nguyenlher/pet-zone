import api from './api';

const PRODUCT_SERVICE_BASE = '/api/public/pet-products';

export const productService = {
  getProductsByStatus: async (status = 'AVAILABLE', page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await api.get(`${PRODUCT_SERVICE_BASE}/status/${status}`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await api.get(`${PRODUCT_SERVICE_BASE}/${productId}`);
    return response.data;
  },

  incrementViewCount: async (productId) => {
    await api.post(`${PRODUCT_SERVICE_BASE}/${productId}/view`);
  },

  getProductsByCategory: async (category, page = 0, size = 12) => {
    const response = await api.get(`${PRODUCT_SERVICE_BASE}/category/${category}`, {
      params: { page, size }
    });
    return response.data;
  },

  searchProducts: async (keyword, page = 0, size = 12) => {
    const response = await api.get(`${PRODUCT_SERVICE_BASE}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },
};

export default productService;
