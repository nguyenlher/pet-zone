import { apiFetch } from './apiClient';
import { BackendProduct, BackendPage, mapBackendProductToProduct } from './dataMapper';
import { Product } from '../types';

export const productService = {
  /**
   * Get all products from API Gateway
   */
  getAllProducts: async (page = 0, size = 50, sortBy = 'createdAt', sortDirection = 'DESC'): Promise<BackendPage<BackendProduct>> => {
    return apiFetch<BackendPage<BackendProduct>>(
      `/public/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
  },

  /**
   * Get products by category (FOOD, CLOTHING, HOUSING, ACCESSORY, OTHER)
   */
  getProductsByCategory: async (category: string, page = 0, size = 50): Promise<BackendPage<BackendProduct>> => {
    return apiFetch<BackendPage<BackendProduct>>(
      `/public/products/category/${category}?page=${page}&size=${size}`
    );
  },

  /**
   * Get single product by ID
   */
  getProductById: async (productId: string): Promise<BackendProduct> => {
    return apiFetch<BackendProduct>(`/public/products/${productId}`);
  },

  /**
   * Search products by keyword
   */
  searchProducts: async (keyword: string, page = 0, size = 50): Promise<BackendPage<BackendProduct>> => {
    return apiFetch<BackendPage<BackendProduct>>(
      `/public/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
  },

  /**
   * Get mapped products by category enum
   */
  getMappedProductsByCategory: async (category: string, page = 0, size = 50): Promise<Product[]> => {
    const pageData = await productService.getProductsByCategory(category, page, size);
    return (pageData.content || []).map(mapBackendProductToProduct);
  },

  /**
   * Get products with SQL filters (category, minPrice, maxPrice, status, keyword, pageable)
   */
  getProductsWithFilters: async (params: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<BackendPage<BackendProduct>> => {
    const q = new URLSearchParams();
    if (params.category) q.append('category', params.category);
    if (params.minPrice !== undefined) q.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) q.append('maxPrice', params.maxPrice.toString());
    if (params.status) q.append('status', params.status);
    if (params.keyword) q.append('keyword', params.keyword);
    q.append('page', (params.page ?? 0).toString());
    q.append('size', (params.size ?? 8).toString());
    if (params.sortBy) q.append('sortBy', params.sortBy);
    if (params.sortDirection) q.append('sortDirection', params.sortDirection);

    return apiFetch<BackendPage<BackendProduct>>(`/public/products/filter?${q.toString()}`);
  },
};

export default productService;
