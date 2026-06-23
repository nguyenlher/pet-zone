import { apiFetch } from './apiClient';
import { BackendPet, BackendPage, mapBackendPetToProduct } from './dataMapper';
import { Product } from '../types';

export const petService = {
  /**
   * Get all public pets from API Gateway
   */
  getAllPets: async (page = 0, size = 50): Promise<BackendPage<BackendPet>> => {
    return apiFetch<BackendPage<BackendPet>>(`/public/pets?page=${page}&size=${size}&sort=createdAt,DESC`);
  },

  /**
   * Get public pet by ID
   */
  getPetById: async (petId: string): Promise<BackendPet> => {
    return apiFetch<BackendPet>(`/public/pets/${petId}`);
  },

  /**
   * Get pets formatted as store Products
   */
  getPetProducts: async (page = 0, size = 50): Promise<Product[]> => {
    const pageData = await petService.getAllPets(page, size);
    return (pageData.content || []).map(mapBackendPetToProduct);
  },

  /**
   * Get pets with SQL filters (minPrice, maxPrice, status, keyword, pageable)
   */
  getPetsWithFilters: async (params: {
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<BackendPage<BackendPet>> => {
    const q = new URLSearchParams();
    if (params.minPrice !== undefined) q.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) q.append('maxPrice', params.maxPrice.toString());
    if (params.status) q.append('status', params.status);
    if (params.keyword) q.append('keyword', params.keyword);
    q.append('page', (params.page ?? 0).toString());
    q.append('size', (params.size ?? 8).toString());
    if (params.sortBy) q.append('sortBy', params.sortBy);
    if (params.sortDirection) q.append('sortDirection', params.sortDirection);

    return apiFetch<BackendPage<BackendPet>>(`/public/pets/filter?${q.toString()}`);
  },
};

export default petService;
