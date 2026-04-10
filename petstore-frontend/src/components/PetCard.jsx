import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/components/PetCard.css';

export default function PetCard({ pet }) {
  const { addItem } = useCart();

  // Calculate age display from ageInMonths
  const getAgeDisplay = (ageInMonths) => {
    if (!ageInMonths) return 'Age unknown';
    if (ageInMonths < 12) return `${ageInMonths} months`;
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="pet-card card">
      <Link to={`/pets/${pet.id}`} className="pet-card-image-wrap">
        <img 
          src={pet.thumbnailUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop'} 
          alt={pet.name} 
          className="pet-card-image" 
          loading="lazy" 
        />
        {pet.status === 'RESERVED' && (
          <span className="pet-card-sale-badge">Reserved</span>
        )}
        <div className="pet-card-overlay">
          <button className="pet-overlay-btn" title="Add to wishlist">
            <Heart size={18} />
          </button>
        </div>
      </Link>

      <div className="pet-card-body">
        <div className="pet-card-category">{pet.breedName || 'Pet'}</div>
        <Link to={`/pets/${pet.id}`} className="pet-card-name">{pet.name}</Link>
        <p className="pet-card-breed">
          {pet.gender} &middot; {getAgeDisplay(pet.ageInMonths)}
        </p>

        <div className="pet-card-rating">
          <Star size={14} className="star-filled" />
          <span>4.5</span>
          <span className="rating-count">({pet.viewCount || 0} views)</span>
        </div>

        <div className="pet-card-footer">
          <div className="pet-card-price">
            <span className="price-current">{formatPrice(pet.price)}</span>
          </div>
          <button
            className="pet-card-cart-btn"
            onClick={(e) => { e.preventDefault(); addItem(pet); }}
            title="Add to cart"
            disabled={pet.status !== 'AVAILABLE'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
