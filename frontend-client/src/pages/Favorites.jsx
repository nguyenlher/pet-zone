import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import favoriteService from '../services/favoriteService';
import petService from '../services/petService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated, navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const favoritesData = await favoriteService.getUserFavorites();
      setFavorites(favoritesData);

      // Load pet details for each favorite
      if (favoritesData.length > 0) {
        const petPromises = favoritesData.map(fav => 
          petService.getPetById(fav.petId).catch(err => {
            console.error(`Failed to load pet ${fav.petId}:`, err);
            return null;
          })
        );
        const petsData = await Promise.all(petPromises);
        setPets(petsData.filter(pet => pet !== null));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setError('Failed to load your favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (petId) => {
    try {
      await favoriteService.removeFavorite(petId);
      setFavorites(favorites.filter(fav => fav.petId !== petId));
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  const handleAddToCart = (pet) => {
    addToCart({
      id: pet.id,
      name: pet.name,
      price: pet.price,
      image: pet.thumbnailUrl || pet.images?.[0]?.imageUrl || '/placeholder-pet.jpg',
      itemType: 'PET'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadFavorites}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-primary" size={32} />
            <h1 className="text-3xl font-heading font-bold text-stone-900">My Favorites</h1>
          </div>
          <p className="text-stone-600">
            {pets.length === 0 
              ? 'You haven\'t added any pets to your favorites yet.' 
              : `You have ${pets.length} favorite ${pets.length === 1 ? 'pet' : 'pets'}`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {pets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Heart size={64} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No favorites yet</h3>
            <p className="text-stone-500 mb-6">Start adding pets to your favorites to see them here!</p>
            <button
              onClick={() => navigate('/pets')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Pets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={pet.thumbnailUrl || pet.images?.[0]?.imageUrl || '/placeholder-pet.jpg'}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(pet.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-md"
                    title="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-stone-900 mb-1 line-clamp-1">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-3 line-clamp-1">
                    {pet.breedName || pet.breed?.name || 'Unknown breed'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary">
                      ${pet.price?.toLocaleString() || 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pet.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {pet.status || 'Unknown'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/pets/${pet.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <Eye size={16} />
                      <span className="text-sm font-medium">View</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(pet)}
                      disabled={pet.status !== 'AVAILABLE'}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={16} />
                      <span className="text-sm font-medium">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
