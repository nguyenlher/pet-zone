import api, { publicApi } from './api';

const PET_SERVICE_BASE = '/api/public/pets';

export const petService = {
  // ============================================
  // PUBLIC READ-ONLY ENDPOINTS (No auth)
  // ============================================
  
  getPetsByStatus: async (status = 'AVAILABLE', page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await publicApi.get(`${PET_SERVICE_BASE}/status/${status}`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getPetById: async (petId) => {
    const response = await publicApi.get(`${PET_SERVICE_BASE}/${petId}`);
    return response.data;
  },

  getPetTypes: async () => {
    const response = await publicApi.get('/api/public/pet-types');
    return response.data;
  },

  getActivePetTypes: async () => {
    const response = await publicApi.get('/api/public/pet-types/active');
    return response.data;
  },

  getPetTypeById: async (typeId) => {
    const response = await publicApi.get(`/api/public/pet-types/${typeId}`);
    return response.data;
  },

  // ============================================
  // TRACKING (No auth required)
  // ============================================
  
  incrementViewCount: async (petId) => {
    await publicApi.get(`${PET_SERVICE_BASE}/${petId}/view`);
  },
};

export default petService;
