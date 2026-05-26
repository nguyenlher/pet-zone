import api from './api';

// ============================================
// FAVORITE SERVICE - All endpoints require JWT
// ============================================

const favoriteService = {
  // Get all user favorites
  getUserFavorites: async () => {
    const response = await api.get('/api/public/users/favorites');
    return response.data;
  },

  // Add pet to favorites
  addFavorite: async (petId) => {
    const response = await api.post('/api/public/users/favorites', { petId });
    return response.data;
  },

  // Remove pet from favorites
  removeFavorite: async (petId) => {
    const response = await api.delete(`/api/public/users/favorites/${petId}`);
    return response.data;
  },

  // Check if pet is in favorites
  checkFavorite: async (petId) => {
    const response = await api.get(`/api/public/users/favorites/${petId}/check`);
    return response.data;
  },

  // Get favorite count
  getFavoriteCount: async () => {
    const response = await api.get('/api/public/users/favorites/count');
    return response.data;
  },

  // Toggle favorite (add if not exists, remove if exists)
  toggleFavorite: async (petId) => {
    try {
      const isFavorite = await favoriteService.checkFavorite(petId);
      if (isFavorite) {
        await favoriteService.removeFavorite(petId);
        return { isFavorite: false, message: 'Removed from favorites' };
      } else {
        await favoriteService.addFavorite(petId);
        return { isFavorite: true, message: 'Added to favorites' };
      }
    } catch (error) {
      throw error;
    }
  }
};

export default favoriteService;
