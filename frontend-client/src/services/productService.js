import api, { publicApi } from './api';

const PRODUCT_SERVICE_BASE = '/api/public/products';

export const productService = {
  // ============================================
  // PUBLIC READ-ONLY ENDPOINTS (No auth)
  // ============================================
  
  getProductsByStatus: async (status = 'AVAILABLE', page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await publicApi.get(`${PRODUCT_SERVICE_BASE}/status/${status}`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await publicApi.get(`${PRODUCT_SERVICE_BASE}/${productId}`);
    return response.data;
  },

  getProductsByCategory: async (category, page = 0, size = 12) => {
    const response = await publicApi.get(`${PRODUCT_SERVICE_BASE}/category/${category}`, {
      params: { page, size }
    });
    return response.data;
  },

  searchProducts: async (keyword, page = 0, size = 12) => {
    const response = await publicApi.get(`${PRODUCT_SERVICE_BASE}/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // ============================================
  // TRACKING (No auth required)
  // ============================================
  
  incrementViewCount: async (productId) => {
    await publicApi.get(`${PRODUCT_SERVICE_BASE}/${productId}/view`);
  },
};

export default productService;
