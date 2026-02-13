import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/components/PetCard.css';

export default function PetCard({ pet }) {
  const { addItem } = useCart();

  return (
    <div className="pet-card card">
      <Link to={`/pets/${pet.id}`} className="pet-card-image-wrap">
        <img src={pet.images[0]} alt={pet.name} className="pet-card-image" loading="lazy" />
        {pet.originalPrice && (
          <span className="pet-card-sale-badge">Sale</span>
        )}
        <div className="pet-card-overlay">
          <button className="pet-overlay-btn" title="Add to wishlist">
            <Heart size={18} />
          </button>
        </div>
      </Link>

      <div className="pet-card-body">
        <div className="pet-card-category">{pet.category}</div>
        <Link to={`/pets/${pet.id}`} className="pet-card-name">{pet.name}</Link>
        <p className="pet-card-breed">{pet.breed} &middot; {pet.age}</p>

        <div className="pet-card-rating">
          <Star size={14} className="star-filled" />
          <span>{pet.rating}</span>
          <span className="rating-count">({pet.reviews})</span>
        </div>

        <div className="pet-card-footer">
          <div className="pet-card-price">
            <span className="price-current">${pet.price}</span>
            {pet.originalPrice && (
              <span className="price-original">${pet.originalPrice}</span>
            )}
          </div>
          <button
            className="pet-card-cart-btn"
            onClick={(e) => { e.preventDefault(); addItem(pet); }}
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
