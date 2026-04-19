import api from './api';

const PET_SERVICE_BASE = '/api/public/pets';

export const petService = {
  // Get all pets by status with pagination
  getPetsByStatus: async (status = 'AVAILABLE', page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await api.get(`${PET_SERVICE_BASE}/status/${status}`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  // Get pet by ID
  getPetById: async (petId) => {
    const response = await api.get(`${PET_SERVICE_BASE}/${petId}`);
    return response.data;
  },

  // Increment view count
  incrementViewCount: async (petId) => {
    await api.post(`${PET_SERVICE_BASE}/${petId}/view`);
  },

  // Get pet types
  getPetTypes: async () => {
    const response = await api.get('/api/public/pet-types');
    return response.data;
  },

  // Get active pet types
  getActivePetTypes: async () => {
    const response = await api.get('/api/public/pet-types/active');
    return response.data;
  },

  // Get pet type by ID
  getPetTypeById: async (typeId) => {
    const response = await api.get(`/api/public/pet-types/${typeId}`);
    return response.data;
  },
};

export default petService;
