import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PetCard({ pet }) {
  const { addItem } = useCart();

  const getAgeDisplay = (ageInMonths) => {
    if (!ageInMonths) return 'Age unknown';
    if (ageInMonths < 12) return `${ageInMonths} months`;
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="card group">
      <Link to={`/pets/${pet.id}`} className="relative block overflow-hidden">
        <img
          src={pet.thumbnailUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop'}
          alt={pet.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {pet.status === 'RESERVED' && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Reserved</span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white shadow-md transition-all" title="Add to wishlist">
            <Heart size={16} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{pet.breedName || 'Pet'}</p>
        <Link to={`/pets/${pet.id}`} className="font-heading font-bold text-stone-900 text-base hover:text-primary transition-colors line-clamp-1">
          {pet.name}
        </Link>
        <p className="text-xs text-stone-500 mt-0.5">{pet.gender} · {getAgeDisplay(pet.ageInMonths)}</p>

        <div className="flex items-center gap-1 mt-2">
          <Star size={13} className="star-filled" />
          <span className="text-xs font-medium text-stone-700">4.5</span>
          <span className="text-xs text-stone-400">({pet.viewCount || 0} views)</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
          <span className="font-heading font-bold text-base text-stone-900">{formatPrice(pet.price)}</span>
          <button
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark shadow-sm shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={(e) => { e.preventDefault(); addItem(pet); }}
            title="Add to cart"
            disabled={pet.status !== 'AVAILABLE'}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
