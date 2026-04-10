import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePets, usePetTypes } from '../hooks/usePets';
import PetCard from '../components/PetCard';
import '../styles/pages/Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

// Mock testimonials (keep for now as they're not in database yet)
const testimonials = [
  {
    id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/100?img=1',
    text: 'Found my perfect companion here! The staff was incredibly helpful, and Buddy has been the best addition to our family.',
    rating: 5, pet: 'Golden Retriever',
  },
  {
    id: 2, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/100?img=3',
    text: 'Amazing selection and the pets are so well taken care of. The adoption process was smooth and transparent.',
    rating: 5, pet: 'Siberian Husky',
  },
  {
    id: 3, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/100?img=5',
    text: 'I love my new kitten! The team helped me choose the perfect breed for my lifestyle. Highly recommended!',
    rating: 4, pet: 'Persian Cat',
  },
];

export default function Home() {
  const { pets: featuredPets, loading: petsLoading } = usePets('AVAILABLE', 0, 8);
  const { petTypes, loading: typesLoading } = usePetTypes();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div className="hero-text" initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="hero-badge">
              <Star size={14} className="star-filled" /> #1 Pet Store in Town
            </span>
            <h1 className="hero-title">
              Find Your Perfect <span className="gradient-text">Furry Friend</span> Today
            </h1>
            <p className="hero-subtitle">
              Discover adorable pets looking for a loving home. From playful puppies to curious kittens, your new best friend is waiting.
            </p>
            <div className="hero-actions">
              <Link to="/pets" className="btn btn-primary btn-lg">
                Browse Pets <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Contact Us
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>500+</strong><span>Happy Pets</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <strong>1.2k+</strong><span>Customers</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <strong>4.9</strong><span>Rating</span>
              </div>
            </div>
          </motion.div>
          <motion.div className="hero-image" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="hero-image-card">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=700&fit=crop" alt="Happy dog" />
              <div className="hero-image-badge">
                <Heart size={16} className="heart-pulse" /> Adopt Me!
              </div>
            </div>
          </motion.div>
        </div>
        <div className="hero-bg-shape" />
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find your perfect companion from our wide selection of pet categories</p>
          </motion.div>
          {typesLoading ? (
            <div className="loading-spinner">Loading categories...</div>
          ) : (
            <div className="category-grid">
              {petTypes.map((type, i) => (
                <motion.div key={type.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                  <Link to={`/pets?type=${type.id}`} className="category-card">
                    <div className="category-image-wrap">
                      <img src={type.iconUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'} alt={type.name} loading="lazy" />
                    </div>
                    <div className="category-info">
                      <h3>{type.name}</h3>
                      <span>{type.description || 'View pets'}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Pets */}
      <section className="section section-featured">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div>
              <h2 className="section-title">Featured Pets</h2>
              <p className="section-subtitle">Meet our most popular and lovable companions</p>
            </div>
            <Link to="/pets" className="btn btn-outline">
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>
          {petsLoading ? (
            <div className="loading-spinner">Loading pets...</div>
          ) : (
            <div className="featured-grid">
              {featuredPets.map((pet, i) => (
                <motion.div key={pet.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                  <PetCard pet={pet} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="section-title">Why Choose PawShop</h2>
            <p className="section-subtitle">We make finding and welcoming your new pet a seamless experience</p>
          </motion.div>
          <div className="benefits-grid">
            {[
              { icon: <Shield size={28} />, title: 'Health Guaranteed', desc: 'All pets come with health certificates and vaccination records.' },
              { icon: <Truck size={28} />, title: 'Safe Delivery', desc: 'Careful and comfortable transportation to your doorstep.' },
              { icon: <Heart size={28} />, title: 'Lifetime Support', desc: 'Free consultation and care guidance for your pet\'s lifetime.' },
              { icon: <Star size={28} />, title: 'Top Quality', desc: 'Only the healthiest and happiest pets from trusted breeders.' },
            ].map((b, i) => (
              <motion.div key={i} className="benefit-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-testimonials">
        <div className="container">
          <motion.div className="section-header center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Hear from happy pet parents who found their perfect match</p>
          </motion.div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} className="testimonial-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="star-filled" />
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.pet}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div className="cta-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2>Ready to Meet Your New Best Friend?</h2>
            <p>Browse our collection of adorable pets and find the perfect companion for your family.</p>
            <Link to="/pets" className="btn btn-primary btn-lg">
              Start Browsing <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
