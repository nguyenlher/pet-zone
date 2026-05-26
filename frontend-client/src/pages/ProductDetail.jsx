 import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, CheckCircle, ChevronRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';

const mockReviews = [
  { id: 1, user: 'Sarah Johnson', rating: 5, date: '2 days ago', comment: 'Absolutely love this! The quality is amazing and it looks exactly like the pictures. My pet is so happy.' },
  { id: 2, user: 'Michael Brown', rating: 4, date: '1 week ago', comment: 'Good product, fast shipping. The packaging was a bit damaged but the item inside was fine.' },
  { id: 3, user: 'Emily Davis', rating: 5, date: '2 weeks ago', comment: 'Highly recommended! Will definitely buy again.' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        
        // Track view count
        try {
          await productService.incrementViewCount(id);
        } catch (err) {
          console.error('Failed to track view:', err);
        }

        // Fetch related products (same category)
        if (data.category) {
          try {
            const related = await productService.getProductsByCategory(data.category, 0, 10);
            let filtered = related.content?.filter(p => p.id !== id) || [];
            
            // Fallback to general products if none found in category
            if (filtered.length === 0) {
              const general = await productService.getProducts('AVAILABLE', 0, 10);
              filtered = general.content?.filter(p => p.id !== id) || [];
            }
            
            setRelatedProducts(filtered.slice(0, 10));
          } catch (err) {
            console.error('Failed to fetch related products:', err);
          }
        } else {
          try {
            const general = await productService.getProducts('AVAILABLE', 0, 10);
            setRelatedProducts(general.content?.filter(p => p.id !== id).slice(0, 10) || []);
          } catch (err) {
            console.error('Failed to fetch related products:', err);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center"><div className="spinner mx-auto mb-4" /><p className="text-stone-500">Loading product details...</p></div>
    </div>
  );

  if (error || !product) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-bold text-stone-700 mb-3">Product not found</h3>
        <p className="text-stone-500 mb-6">{error || "The product you're looking for doesn't exist."}</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const images = product.imageUrls?.length ? product.imageUrls : (product.images?.map(img => img.imageUrl) || []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem({ ...product, itemType: 'PRODUCT' });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-stone-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight size={13} />
          <span className="text-stone-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {images.length > 0 ? (
              <>
                <div className="rounded-2xl overflow-hidden mb-3 aspect-square bg-stone-100">
                  <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary' : 'border-stone-200'}`}>
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl aspect-square bg-stone-100 flex items-center justify-center">
                <Package size={64} className="text-stone-300" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="badge badge-primary mb-3">{product.category || 'Product'}</span>
            <h1 className="font-heading text-4xl font-bold text-stone-900 mb-1">{product.name}</h1>
            <p className="text-stone-500 mb-4">{product.brand || 'Pet Product'}</p>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < 4 ? 'star-filled' : 'star-empty'} />)}</div>
              <span className="text-sm font-medium text-stone-700">4.5</span>
              <span className="text-sm text-stone-400">({product.viewCount || 0} views)</span>
            </div>

            <p className="font-heading text-3xl font-bold text-stone-900 mb-5">{formatPrice(product.price)}</p>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Category', value: product.category || 'N/A' },
                { label: 'Brand', value: product.brand || 'N/A' },
                { label: 'Stock', value: product.stockQuantity ? `${product.stockQuantity} units` : 'In Stock' },
                { label: 'Status', value: product.status || 'AVAILABLE' }
              ].map(spec => (
                <div key={spec.label} className="bg-stone-50 rounded-xl px-4 py-3">
                  <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-0.5">{spec.label}</span>
                  <span className="text-sm font-semibold text-stone-900">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.status === 'AVAILABLE' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold"><CheckCircle size={13} /> Available</span>}
              {product.featured && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold"><Star size={13} /> Featured</span>}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                <button className="px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="px-4 py-3 font-semibold text-stone-900 min-w-[48px] text-center">{quantity}</span>
                <button className="px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={`btn flex-1 justify-center ${added ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleAddToCart} disabled={product.status !== 'AVAILABLE'}>
                <ShoppingCart size={18} />
                {added ? 'Added to Cart!' : product.status === 'AVAILABLE' ? 'Add to Cart' : 'Not Available'}
              </button>
              <button className="btn btn-secondary p-3"><Heart size={18} /></button>
            </div>

            <div className="flex gap-4 bg-amber-50 rounded-xl p-4">
              <span className="flex items-center gap-1.5 text-sm text-stone-600"><Shield size={15} className="text-primary" /> Quality Guaranteed</span>
              <span className="flex items-center gap-1.5 text-sm text-stone-600"><Truck size={15} className="text-primary" /> Fast Delivery</span>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="border-t border-stone-200 pt-16 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-stone-900">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-amber-400">
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current opacity-50" />
              </div>
              <span className="font-medium text-stone-700 text-lg">4.0</span>
              <span className="text-stone-500">({mockReviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold font-heading">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{review.user}</p>
                      <p className="text-xs text-stone-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-stone-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-stone-200 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-bold text-stone-900">Related Products</h2>
              <Link to="/products" className="text-primary font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
            </div>
            
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop={relatedProducts.length > 4}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              className="!pb-20 !px-2"
              style={{ '--swiper-pagination-bottom': '10px' }}
            >
              {relatedProducts.map(p => (
                <SwiperSlide key={p.id} className="h-auto">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 h-full flex flex-col group">
                    <div className="relative aspect-square overflow-hidden bg-stone-50">
                      <Link to={`/products/${p.id}`} className="block w-full h-full">
                        {p.imageUrls?.[0] || p.images?.[0]?.imageUrl ? (
                          <img src={p.imageUrls?.[0] || p.images?.[0]?.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package size={48} className="text-stone-300" /></div>
                        )}
                      </Link>
                      {/* Action Overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                        <button className="bg-white p-2.5 rounded-full shadow-md text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors" title="Add to Wishlist">
                          <Heart size={18} />
                        </button>
                      </div>
                      {p.status === 'OUT_OF_STOCK' && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Sold Out
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-medium text-stone-600">4.5</span>
                      </div>
                      
                      <Link to={`/products/${p.id}`} className="block mb-1">
                        <h3 className="font-heading font-bold text-stone-900 text-lg line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
                      </Link>
                      
                      <p className="text-sm text-stone-500 mb-4">{p.category}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <p className="font-heading text-xl font-bold text-primary">{formatPrice(p.price)}</p>
                        <button 
                          className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(p);
                          }}
                          disabled={p.status !== 'AVAILABLE'}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}
      </div>
    </div>
  );
}
