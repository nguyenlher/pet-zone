// src/services/petService.js
import api from './api';

export const petService = {
  // Get all pet types
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
  getPetTypeById: async (id) => {
    const response = await api.get(`/api/public/pet-types/${id}`);
    return response.data;
  },

  // Get all breeds
  getBreeds: async () => {
    const response = await api.get('/api/public/breeds');
    return response.data;
  },

  // Get breeds by pet type
  getBreedsByPetType: async (petTypeId) => {
    const response = await api.get(`/api/public/breeds/pet-type/${petTypeId}`);
    return response.data;
  },

  // Get breed by ID
  getBreedById: async (id) => {
    const response = await api.get(`/api/public/breeds/${id}`);
    return response.data;
  },

  // Get all pets with pagination
  getPets: async (page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await api.get('/api/public/pets', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get pets by status
  getPetsByStatus: async (status, page = 0, size = 12, sort = 'createdAt,desc') => {
    const response = await api.get(`/api/public/pets/status/${status}`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get pet by ID
  getPetById: async (id) => {
    const response = await api.get(`/api/public/pets/${id}`);
    return response.data;
  },

  // Increment pet view count
  incrementViewCount: async (id) => {
    const response = await api.post(`/api/public/pets/${id}/view`);
    return response.data;
  },

  // Admin endpoints (private)
  // Create pet
  createPet: async (petData) => {
    const response = await api.post('/api/private/pets', petData);
    return response.data;
  },

  // Update pet
  updatePet: async (id, petData) => {
    const response = await api.put(`/api/private/pets/${id}`, petData);
    return response.data;
  },

  // Delete pet
  deletePet: async (id) => {
    const response = await api.delete(`/api/private/pets/${id}`);
    return response.data;
  },

  // Create pet type
  createPetType: async (petTypeData) => {
    const response = await api.post('/api/private/pet-types', petTypeData);
    return response.data;
  },

  // Update pet type
  updatePetType: async (id, petTypeData) => {
    const response = await api.put(`/api/private/pet-types/${id}`, petTypeData);
    return response.data;
  },

  // Delete pet type
  deletePetType: async (id) => {
    const response = await api.delete(`/api/private/pet-types/${id}`);
    return response.data;
  },

  // Create breed
  createBreed: async (breedData) => {
    const response = await api.post('/api/private/breeds', breedData);
    return response.data;
  },

  // Update breed
  updateBreed: async (id, breedData) => {
    const response = await api.put(`/api/private/breeds/${id}`, breedData);
    return response.data;
  },

  // Delete breed
  deleteBreed: async (id) => {
    const response = await api.delete(`/api/private/breeds/${id}`);
    return response.data;
  },

  // Save 3D model for pet
  save3DModel: async (petId, modelUrl, sourceImageUrl) => {
    const response = await api.post('/api/public/pets/3d-model', {
      petId,
      modelUrl,
      sourceImageUrl,
    });
    return response.data;
  },
};
