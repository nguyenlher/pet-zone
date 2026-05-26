import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import favoriteService from '../services/favoriteService';

export default function FavoriteButton({ petId, size = 'md', className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && petId) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, petId]);

  const checkFavoriteStatus = async () => {
    try {
      const status = await favoriteService.checkFavorite(petId);
      setIsFavorite(status);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await favoriteService.toggleFavorite(petId);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${isFavorite 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-white hover:text-red-500'
        }
        rounded-full transition-all duration-200 shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={iconSizes[size]} 
        fill={isFavorite ? 'currentColor' : 'none'}
        className={loading ? 'animate-pulse' : ''}
      />
    </button>
  );
}
