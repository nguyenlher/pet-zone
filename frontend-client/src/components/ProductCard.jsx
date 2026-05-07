import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/components/PetCard.css'; // Reuse PetCard styles

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get category display name
  const getCategoryName = (category) => {
    const categories = {
      'FOOD': 'Food',
      'TOY': 'Toy',
      'ACCESSORY': 'Accessory',
      'GROOMING': 'Grooming',
      'HEALTH': 'Health',
      'OTHER': 'Other'
    };
    return categories[category] || category;
  };

  return (
    <div className="pet-card card">
      <Link to={`/products/${product.id}`} className="pet-card-image-wrap">
        <img 
          src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=500&fit=crop'} 
          alt={product.name} 
          className="pet-card-image" 
          loading="lazy" 
        />
        {product.status === 'OUT_OF_STOCK' && (
          <span className="pet-card-sale-badge">Out of Stock</span>
        )}
        {product.soldCount > 100 && (
          <span className="pet-card-sale-badge" style={{background: '#10b981'}}>Best Seller</span>
        )}
        <div className="pet-card-overlay">
          <button className="pet-overlay-btn" title="Add to wishlist">
            <Heart size={18} />
          </button>
        </div>
      </Link>

      <div className="pet-card-body">
        <div className="pet-card-category">{getCategoryName(product.category)}</div>
        <Link to={`/products/${product.id}`} className="pet-card-name">{product.name}</Link>
        <p className="pet-card-breed">
          {product.brand || 'No brand'} {product.stockQuantity > 0 && `• ${product.stockQuantity} in stock`}
        </p>

        <div className="pet-card-rating">
          <Star size={14} className="star-filled" />
          <span>{product.avgRating?.toFixed(1) || '0.0'}</span>
          <span className="rating-count">({product.totalReviews || 0} reviews)</span>
        </div>

        <div className="pet-card-footer">
          <div className="pet-card-price">
            <span className="price-current">{formatPrice(product.price)}</span>
          </div>
          <button
            className="pet-card-cart-btn"
            onClick={(e) => { 
              e.preventDefault(); 
              addItem({ ...product, type: 'product' }); 
            }}
            title="Add to cart"
            disabled={product.status !== 'AVAILABLE' || product.stockQuantity === 0}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
