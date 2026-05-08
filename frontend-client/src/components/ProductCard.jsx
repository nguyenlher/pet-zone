import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getCategoryName = (category) => {
    const categories = { FOOD: 'Food', TOY: 'Toy', ACCESSORY: 'Accessory', GROOMING: 'Grooming', HEALTH: 'Health', OTHER: 'Other' };
    return categories[category] || category;
  };

  return (
    <div className="card group">
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden">
        <img
          src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=500&fit=crop'}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.status === 'OUT_OF_STOCK' && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Out of Stock</span>
        )}
        {product.soldCount > 100 && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Best Seller</span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white shadow-md transition-all">
            <Heart size={16} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{getCategoryName(product.category)}</p>
        <Link to={`/products/${product.id}`} className="font-heading font-bold text-stone-900 text-base hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-xs text-stone-500 mt-0.5">
          {product.brand || 'No brand'} {product.stockQuantity > 0 && `• ${product.stockQuantity} in stock`}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star size={13} className="star-filled" />
          <span className="text-xs font-medium text-stone-700">{product.avgRating?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-stone-400">({product.totalReviews || 0} reviews)</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
          <span className="font-heading font-bold text-base text-stone-900">{formatPrice(product.price)}</span>
          <button
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark shadow-sm shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={(e) => { e.preventDefault(); addItem({ ...product, type: 'product' }); }}
            title="Add to cart"
            disabled={product.status !== 'AVAILABLE' || product.stockQuantity === 0}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
