import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePets, usePetTypes } from '../hooks/usePets';
import PetCard from '../components/PetCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Pets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const activeType = searchParams.get('type') || 'all';
  const { pets, loading: petsLoading } = usePets('AVAILABLE', page, 50);
  const { petTypes } = usePetTypes();

  const setType = (typeId) => {
    if (typeId === 'all') { searchParams.delete('type'); } else { searchParams.set('type', typeId); }
    setSearchParams(searchParams);
    setPage(0);
  };

  const filteredPets = useMemo(() => {
    let result = [...pets];
    
    if (activeType !== 'all') {
      result = result.filter(p => String(p.petTypeId) === String(activeType));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.breedName && p.breedName.toLowerCase().includes(q)));
    }
    result = result.filter(p => { const price = Number(p.price); return price >= priceRange[0] && price <= priceRange[1]; });
    switch (sort) {
      case 'price-asc': result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case 'price-desc': result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'views': result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [activeType, pets, search, sort, priceRange]);

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <h1 className="font-heading text-4xl font-bold text-stone-900">
            {activeType === 'all' ? 'All Pets' : petTypes.find(t => t.id === activeType)?.name || 'Pets'}
          </h1>
          <p className="text-stone-500 mt-1">{filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} available</p>
        </motion.div>

        {/* Controls */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
            {search && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" onClick={() => setSearch('')}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select className="input-field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="views">Most Viewed</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </motion.div>

        {/* Filter bar */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
            <label className="text-sm font-medium text-stone-600 mb-2 block">
              Price Range: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])} – {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
            </label>
            <input type="range" min="0" max="50000000" step="1000000" value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full" />
          </motion.div>
        )}

        {/* Category tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setType('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeType === 'all' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-primary hover:text-primary'}`}>
            All
          </button>
          {petTypes.map(type => (
            <button key={type.id} onClick={() => setType(type.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeType === type.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-primary hover:text-primary'}`}>
              {type.name}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {petsLoading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet, i) => (
              <motion.div key={pet.id} initial="hidden" animate="visible" custom={i} variants={fadeInUp}>
                <PetCard pet={pet} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Search size={48} strokeWidth={1} className="mb-4" />
            <h3 className="font-heading text-xl font-bold text-stone-700 mb-2">No pets found</h3>
            <p className="text-sm mb-6">Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setType('all'); setPriceRange([0, 50000000]); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
