import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { pets, categories } from '../data/mockData';
import PetCard from '../components/PetCard';
import '../styles/pages/Pets.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Pets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || 'all';

  const setCategory = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filteredPets = useMemo(() => {
    let result = [...pets];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, search, sort, priceRange]);

  return (
    <div className="pets-page">
      <div className="container">
        {/* Header */}
        <motion.div className="pets-header" initial="hidden" animate="visible" variants={fadeInUp}>
          <div>
            <h1 className="page-title">
              {activeCategory === 'all' ? 'All Pets' : categories.find(c => c.slug === activeCategory)?.name || 'Pets'}
            </h1>
            <p className="page-subtitle">
              {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div className="pets-controls" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="controls-right">
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Top Rated</option>
            </select>
            <button className="filter-toggle btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </motion.div>

        {/* Filter bar */}
        {showFilters && (
          <motion.div className="filter-bar animate-slide-down" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className="filter-group">
              <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="range-input"
              />
            </div>
          </motion.div>
        )}

        {/* Category tabs */}
        <motion.div className="category-tabs" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
              <span className="tab-count">{cat.count}</span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filteredPets.length > 0 ? (
          <div className="pets-grid">
            {filteredPets.map((pet, i) => (
              <motion.div key={pet.id} initial="hidden" animate="visible" custom={i} variants={fadeInUp}>
                <PetCard pet={pet} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={48} />
            <h3>No pets found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory('all'); setPriceRange([0, 5000]); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
