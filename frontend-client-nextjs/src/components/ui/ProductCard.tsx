'use client';

import React, { useState } from 'react';
import { StoreItem, isPetItem } from '../../types';
import { Star, Plus, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: StoreItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, setQuickViewProduct, cart, setIsCartOpen } = useCart();

  const isInCart = cart.some((item) => item.product.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      // Already in cart -> open cart drawer to view
      setIsCartOpen(true);
      return;
    }
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(product.originalPrice)
    : null;

  // Detect pet products and resolve pet name vs breed name
  const isPetProduct = isPetItem(product);

  let displayBadge = product.badge;
  let displayName = product.name;

  if (isPetItem(product)) {
    // 1. Resolve Pet Name for Top-Left Badge (e.g. "CHARLIE")
    if (product.petName) {
      displayBadge = product.petName.toUpperCase();
    } else {
      const match = product.name.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        displayBadge = match[1].trim().toUpperCase();
      } else if (displayBadge?.toLowerCase() === 'xem 3d' || !displayBadge) {
        displayBadge = product.name.toUpperCase();
      }
    }

    if (displayBadge?.toUpperCase() === 'XEM 3D') {
      displayBadge = (product.petName || displayName).toUpperCase();
    }

    // 2. Resolve Name Below: Format as type + breed (e.g. "Chó Poodle", "Mèo Bengal")
    let breed = product.breedName;
    if (!breed) {
      const match = product.name.match(/^.+?\s*\((.+?)\)$/);
      breed = match ? match[1].trim() : product.name;
    }

    const type =
      product.petTypeName ||
      (breed.toLowerCase().includes('mèo') || product.description?.toLowerCase().includes('mèo')
        ? 'Mèo'
        : 'Chó');

    if (!breed.toLowerCase().startsWith('chó') && !breed.toLowerCase().startsWith('mèo')) {
      displayName = `${type} ${breed}`;
    } else {
      displayName = breed;
    }
  } else {
    // For non-pet products (Thức Ăn, Quần Áo, Nhà / Chuồng, Phụ Kiện, etc.)
    if (product.soldCount !== undefined) {
      displayBadge = `Đã bán ${product.soldCount}`;
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-neutral-200 p-4 transition-colors duration-200 hover:border-black select-none cursor-pointer rounded-none"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Badges Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 pointer-events-none">
        {displayBadge && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-black text-white border border-white/20 rounded-none shadow-sm">
            {displayBadge}
          </span>
        )}
      </div>

      {/* Quick View Button on Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setQuickViewProduct(product);
        }}
        className="absolute top-6 right-6 z-10 w-8 h-8 rounded-none bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
        title="Xem nhanh chi tiết"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {/* Product Image with Dual Angle Switch */}
      <div className="relative w-full aspect-square rounded-none overflow-hidden bg-neutral-100 flex items-center justify-center border border-neutral-100">
        {/* Primary Image */}
        <img
          src={product.image}
          alt={displayName}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />
        {/* Secondary Angle Image on Hover */}
        <img
          src={product.hoverImage}
          alt={`${displayName} góc khác`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Hover Darkening Overlay to make the THÊM GIỎ HÀNG button pop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-none z-[5] ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Quick Add Button Centered in Image on Hover */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-3 pointer-events-none">
          <motion.button
            initial={false}
            animate={{
              scale: isHovered ? 1 : 0.85,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleQuickAdd}
            className={`pointer-events-auto px-4 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xl ${
              isInCart || isAdded
                ? 'bg-neutral-900 text-white border border-neutral-700 hover:bg-black'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
            title={isInCart ? 'Đã có trong giỏ hàng - Bấm để xem giỏ' : 'Thêm vào giỏ hàng'}
          >
            {isInCart || isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã thêm vào giỏ</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm giỏ hàng</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px]">{product.category}</span>
            <div className="flex items-center gap-1 font-medium text-neutral-500">
              <Star className="w-3 h-3 fill-neutral-400 text-neutral-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className={`font-bold text-black text-sm tracking-wide line-clamp-1 group-hover:underline ${isPetProduct ? '' : 'uppercase'}`}>
            {displayName}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* Stock Status & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            {product.inStock ? 'Sẵn hàng' : 'Hết hàng'}
          </span>

          {/* Pricing */}
          <div className="text-right">
            {formattedOriginalPrice && (
              <span className="text-[11px] text-neutral-400 line-through mr-1.5">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-sm font-extrabold text-black tracking-tight">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
