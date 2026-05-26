import { useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, CheckCircle, ChevronRight, Image, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { usePetDetail, usePets } from '../hooks/usePets';
import { useCart } from '../context/CartContext';
import PetCard from '../components/PetCard';

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

  if (loading) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center"><div className="spinner mx-auto mb-4" /><p className="text-stone-500">Loading pet details...</p></div>
    </div>
  );

  if (error || !pet) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-bold text-stone-700 mb-3">Pet not found</h3>
        <p className="text-stone-500 mb-6">{error || "The pet you're looking for doesn't exist."}</p>
        <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
      </div>
    </div>
  );

  const images = pet.imageUrls?.length ? pet.imageUrls : (pet.images?.map(img => img.imageUrl) || []);
  const hasModel = pet.model3d && pet.model3d.modelUrl;
  const breedId = pet.breed?.id || pet.breedId;
  let relatedPets = allPets.filter(p => {
    const pBreedId = p.breed?.id || p.breedId;
    return pBreedId === breedId && p.id !== pet.id;
  }).slice(0, 10);
  
  if (relatedPets.length === 0) {
    relatedPets = allPets.filter(p => p.id !== pet.id).slice(0, 10);
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem({ ...pet, itemType: 'PET' });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const getAgeDisplay = (months) => {
    if (!months) return 'Age unknown';
    if (months < 12) return `${months} months`;
    const y = Math.floor(months / 12), m = months % 12;
    return m > 0 ? `${y}y ${m}m` : `${y} years`;
  };

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-stone-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link to="/pets" className="hover:text-primary transition-colors">Pets</Link>
          <ChevronRight size={13} />
          <span className="text-stone-900 font-medium">{pet.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images / 3D */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {hasModel && (
              <div className="flex gap-2 mb-3">
                {[{ mode: 'photos', icon: Image, label: 'Photos' }, { mode: '3d', icon: Box, label: '3D View' }].map(({ mode, icon: Icon, label }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${viewMode === mode ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-stone-200 hover:border-primary'}`}>
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
            )}

            {viewMode === '3d' && hasModel && (
              <Suspense fallback={
                <div className="viewer-3d-container flex items-center justify-center">
                  <div className="text-center text-stone-400">
                    <div className="spinner mx-auto mb-3" />
                    <p className="text-sm">Loading 3D Viewer...</p>
                  </div>
                </div>
              }>
                <Pet3DViewer modelUrl={pet.model3d.modelUrl} petName={pet.name} />
              </Suspense>
            )}

            {viewMode === 'photos' && images.length > 0 && (
              <>
                <div className="rounded-2xl overflow-hidden mb-3 aspect-square bg-stone-100">
                  <img src={images[selectedImage]} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary' : 'border-stone-200'}`}>
                      <img src={img} alt={`${pet.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="badge badge-primary mb-3">{pet.breedName || 'Pet'}</span>
            <h1 className="font-heading text-4xl font-bold text-stone-900 mb-1">{pet.name}</h1>
            <p className="text-stone-500 mb-4">{pet.breedName || pet.breed?.name || 'Unknown breed'}</p>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < 4 ? 'star-filled' : 'star-empty'} />)}</div>
              <span className="text-sm font-medium text-stone-700">4.5</span>
              <span className="text-sm text-stone-400">({pet.viewCount || 0} views)</span>
            </div>

            <p className="font-heading text-3xl font-bold text-stone-900 mb-5">{formatPrice(pet.price)}</p>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">{pet.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[{ label: 'Age', value: getAgeDisplay(pet.ageInMonths) }, { label: 'Gender', value: pet.gender }, { label: 'Weight', value: pet.weight ? `${pet.weight} kg` : 'N/A' }, { label: 'Colors', value: pet.colors?.join(', ') || 'N/A' }].map(spec => (
                <div key={spec.label} className="bg-stone-50 rounded-xl px-4 py-3">
                  <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-0.5">{spec.label}</span>
                  <span className="text-sm font-semibold text-stone-900">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {pet.vaccinated && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold"><CheckCircle size={13} /> Vaccinated</span>}
              {pet.healthStatus === 'EXCELLENT' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold"><Shield size={13} /> Excellent Health</span>}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                <button className="px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="px-4 py-3 font-semibold text-stone-900 min-w-[48px] text-center">{quantity}</span>
                <button className="px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={`btn flex-1 justify-center ${added ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleAddToCart} disabled={pet.status !== 'AVAILABLE'}>
                <ShoppingCart size={18} />
                {added ? 'Added to Cart!' : pet.status === 'AVAILABLE' ? 'Add to Cart' : 'Not Available'}
              </button>
              <button className="btn btn-secondary p-3"><Heart size={18} /></button>
            </div>

            <div className="flex gap-4 bg-amber-50 rounded-xl p-4">
              <span className="flex items-center gap-1.5 text-sm text-stone-600"><Shield size={15} className="text-primary" /> Health Guaranteed</span>
              <span className="flex items-center gap-1.5 text-sm text-stone-600"><Truck size={15} className="text-primary" /> Safe Delivery</span>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {relatedPets.length > 0 && (
          <section className="border-t border-stone-200 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-bold text-stone-900">Related Pets</h2>
              <Link to="/pets" className="text-primary font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
            </div>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop={relatedPets.length > 4}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              className="!pb-20 !px-2"
              style={{ '--swiper-pagination-bottom': '10px' }}
            >
              {relatedPets.map(p => (
                <SwiperSlide key={p.id} className="h-auto">
                  <PetCard pet={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}
      </div>
    </div>
  );
}
