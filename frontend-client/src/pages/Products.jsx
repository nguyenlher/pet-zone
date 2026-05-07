import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import '../styles/pages/Pets.css'; // Reuse Pets page styles

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'FOOD', name: 'Food' },
  { id: 'TOY', name: 'Toys' },
  { id: 'ACCESSORY', name: 'Accessories' },
  { id: 'GROOMING', name: 'Grooming' },
  { id: 'HEALTH', name: 'Health' },
  { id: 'OTHER', name: 'Other' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000000]); // VND
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const activeCategory = searchParams.get('category') || 'all';
  const { products, loading, totalPages } = useProducts('AVAILABLE', page, 50);

  const setCategory = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
    setPage(0);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
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
      case 'rating': result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)); break;
      case 'popular': result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, products, search, sort, priceRange]);

  return (
    <div className="pets-page">
      <div className="container">
        {/* Header */}
        <motion.div className="pets-header" initial="hidden" animate="visible" variants={fadeInUp}>
          <div>
            <h1 className="page-title">
              {activeCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === activeCategory)?.name || 'Products'}
            </h1>
            <p className="page-subtitle">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div className="pets-controls" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
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
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
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
                max="5000000"
                step="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="range-input"
              />
            </div>
          </motion.div>
        )}

        {/* Category tabs */}
        <motion.div className="category-tabs" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="pets-grid">
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} initial="hidden" animate="visible" custom={i} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory('all'); setPriceRange([0, 5000000]); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
