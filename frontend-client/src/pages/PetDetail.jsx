import { useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, CheckCircle, ChevronRight, Image, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePetDetail, usePets } from '../hooks/usePets';
import { useCart } from '../context/CartContext';
import PetCard from '../components/PetCard';
import '../styles/pages/PetDetail.css';
import '../styles/components/Pet3DViewer.css';

const Pet3DViewer = lazy(() => import('../components/Pet3DViewer'));

export default function PetDetail() {
  const { id } = useParams();
  const { pet, loading, error } = usePetDetail(id);
  const { pets: allPets } = usePets('AVAILABLE', 0, 20);
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState('photos');

  if (loading) {
    return (
      <div className="pet-detail-page">
        <div className="container">
          <div className="loading-spinner">Loading pet details...</div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="pet-detail-page">
        <div className="container">
          <div className="empty-state">
            <h3>Pet not found</h3>
            <p>{error || "The pet you're looking for doesn't exist."}</p>
            <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = pet.imageUrls?.length
    ? pet.imageUrls
    : (pet.images?.map(img => img.imageUrl) || []);
  const hasModel = pet.model3d && pet.model3d.modelUrl;
  const relatedPets = allPets.filter(p => p.breedId === pet.breedId && p.id !== pet.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(pet);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getAgeDisplay = (ageInMonths) => {
    if (!ageInMonths) return 'Age unknown';
    if (ageInMonths < 12) return `${ageInMonths} months`;
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
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
          <span>{pet.name}</span>
        </nav>

        <div className="detail-grid">
          {/* Images / 3D Viewer */}
          <motion.div className="detail-images" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* View mode tabs */}
            {hasModel && (
              <div className="detail-view-tabs">
                <button
                  className={`detail-view-tab ${viewMode === 'photos' ? 'active' : ''}`}
                  onClick={() => setViewMode('photos')}
                >
                  <Image size={16} /> Photos
                </button>
                <button
                    className={`detail-view-tab ${viewMode === '3d' ? 'active' : ''}`}
                    onClick={() => setViewMode('3d')}
                >
                  <Box size={16} /> 3D View
                </button>
              </div>
            )}

            {/* 3D Viewer */}
            {viewMode === '3d' && hasModel && (
              <Suspense fallback={
                <div className="viewer-3d-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid #e7e5e4', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    Loading 3D Viewer...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                </div>
              }>
                <Pet3DViewer modelUrl={pet.model3d.modelUrl} petName={pet.name} />
              </Suspense>
            )}

            {/* Photo gallery */}
            {viewMode === 'photos' && images.length > 0 && (
              <>
                <div className="main-image-wrap">
                  <img src={images[selectedImage]} alt={pet.name} className="main-image" />
                </div>
                <div className="thumb-list">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`thumb ${i === selectedImage ? 'active' : ''}`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <img src={img} alt={`${pet.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Info */}
          <motion.div className="detail-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="detail-category badge badge-primary">{pet.breedName || 'Pet'}</div>
            <h1 className="detail-name">{pet.name}</h1>
            <p className="detail-breed">{pet.breed?.name || pet.breedName}</p>

            <div className="detail-rating">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < 4 ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span className="rating-value">4.5</span>
              <span className="rating-count">({pet.viewCount || 0} views)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">{formatPrice(pet.price)}</span>
            </div>

            <p className="detail-description">{pet.description}</p>

            <div className="detail-specs">
              {[
                { label: 'Age', value: getAgeDisplay(pet.ageInMonths) },
                { label: 'Gender', value: pet.gender },
                { label: 'Weight', value: pet.weight ? `${pet.weight} kg` : 'N/A' },
                { label: 'Colors', value: pet.colors?.join(', ') || 'N/A' },
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
              {pet.healthStatus === 'EXCELLENT' && (
                <span className="detail-tag tag-info"><Shield size={14} /> Excellent Health</span>
              )}
            </div>

            <div className="detail-actions">
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button 
                className={`btn btn-primary btn-lg flex-1 ${added ? 'added' : ''}`} 
                onClick={handleAddToCart}
                disabled={pet.status !== 'AVAILABLE'}
              >
                <ShoppingCart size={18} />
                {added ? 'Added to Cart!' : pet.status === 'AVAILABLE' ? 'Add to Cart' : 'Not Available'}
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
