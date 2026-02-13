import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, CheckCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { pets } from '../data/mockData';
import { useCart } from '../context/CartContext';
import PetCard from '../components/PetCard';
import '../styles/pages/PetDetail.css';

export default function PetDetail() {
  const { id } = useParams();
  const pet = pets.find(p => p.id === parseInt(id));
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!pet) {
    return (
      <div className="pet-detail-page">
        <div className="container">
          <div className="empty-state">
            <h3>Pet not found</h3>
            <p>The pet you're looking for doesn't exist.</p>
            <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedPets = pets.filter(p => p.category === pet.category && p.id !== pet.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(pet);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pet-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/pets">Pets</Link>
          <ChevronRight size={14} />
          <Link to={`/pets?category=${pet.category}`}>{pet.category}</Link>
          <ChevronRight size={14} />
          <span>{pet.name}</span>
        </nav>

        <div className="detail-grid">
          {/* Images */}
          <motion.div className="detail-images" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="main-image-wrap">
              <img src={pet.images[selectedImage]} alt={pet.name} className="main-image" />
            </div>
            <div className="thumb-list">
              {pet.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${pet.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div className="detail-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="detail-category badge badge-primary">{pet.category}</div>
            <h1 className="detail-name">{pet.name}</h1>
            <p className="detail-breed">{pet.breed}</p>

            <div className="detail-rating">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(pet.rating) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span className="rating-value">{pet.rating}</span>
              <span className="rating-count">({pet.reviews} reviews)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">${pet.price}</span>
              {pet.originalPrice && <span className="detail-original">${pet.originalPrice}</span>}
              {pet.originalPrice && (
                <span className="detail-discount">{Math.round((1 - pet.price / pet.originalPrice) * 100)}% OFF</span>
              )}
            </div>

            <p className="detail-description">{pet.description}</p>

            <div className="detail-specs">
              {[
                { label: 'Age', value: pet.age },
                { label: 'Gender', value: pet.gender },
                { label: 'Weight', value: pet.weight },
                { label: 'Color', value: pet.color },
              ].map(spec => (
                <div key={spec.label} className="spec-item">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="detail-tags">
              {pet.vaccinated && (
                <span className="detail-tag tag-success"><CheckCircle size={14} /> Vaccinated</span>
              )}
              {pet.neutered && (
                <span className="detail-tag tag-info"><Shield size={14} /> Neutered</span>
              )}
            </div>

            <div className="detail-actions">
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={`btn btn-primary btn-lg flex-1 ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary wishlist-btn">
                <Heart size={18} />
              </button>
            </div>

            <div className="detail-benefits">
              <div className="benefit-mini"><Shield size={16} /> Health Guaranteed</div>
              <div className="benefit-mini"><Truck size={16} /> Safe Delivery</div>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {relatedPets.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">Related Pets</h2>
            <div className="related-grid">
              {relatedPets.map(p => <PetCard key={p.id} pet={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
