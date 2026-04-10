import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePets, usePetTypes } from '../hooks/usePets';
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
  const [priceRange, setPriceRange] = useState([0, 50000000]); // VND
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const activeType = searchParams.get('type') || 'all';
  const { pets, loading: petsLoading, totalPages } = usePets('AVAILABLE', page, 50);
  const { petTypes, loading: typesLoading } = usePetTypes();

  const setType = (typeId) => {
    if (typeId === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', typeId);
    }
    setSearchParams(searchParams);
    setPage(0);
  };

  const filteredPets = useMemo(() => {
    let result = [...pets];

    if (activeType !== 'all') {
      // Filter by type will be done via API in future
      // For now, we show all pets
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.breedName && p.breedName.toLowerCase().includes(q))
      );
    }

    result = result.filter(p => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case 'price-asc': result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case 'price-desc': result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'views': result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)); break;
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
              {activeType === 'all' ? 'All Pets' : petTypes.find(t => t.id === activeType)?.name || 'Pets'}
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
              <option value="views">Most Viewed</option>
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
              <label>Price Range: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}</label>
              <input
                type="range"
                min="0"
                max="50000000"
                step="1000000"
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
            className={`category-tab ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => setType('all')}
          >
            All
          </button>
          {petTypes.map(type => (
            <button
              key={type.id}
              className={`category-tab ${activeType === type.id ? 'active' : ''}`}
              onClick={() => setType(type.id)}
            >
              {type.name}
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
