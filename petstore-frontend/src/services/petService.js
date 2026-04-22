import api from './api';

const PET_SERVICE_BASE = '/api/public/pets';

export const petService = {
  getPetsByStatus: async (status = 'AVAILABLE', page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await api.get(`${PET_SERVICE_BASE}/status/${status}`, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getPetById: async (petId) => {
    const response = await api.get(`${PET_SERVICE_BASE}/${petId}`);
    return response.data;
  },

  incrementViewCount: async (petId) => {
    await api.post(`${PET_SERVICE_BASE}/${petId}/view`);
  },

  getPetTypes: async () => {
    const response = await api.get('/api/public/pet-types');
    return response.data;
  },

  getActivePetTypes: async () => {
    const response = await api.get('/api/public/pet-types/active');
    return response.data;
  },

  getPetTypeById: async (typeId) => {
    const response = await api.get(`/api/public/pet-types/${typeId}`);
    return response.data;
  },
};

export default petService;
