'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../../types';
import { Star, Plus, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, setQuickViewProduct } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);

    // Subtle celebratory confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4F442', '#FF6B4A', '#2D4A3E'],
      ticks: 100,
    });

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

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/80 p-4 transition-all duration-300 hover:shadow-xl hover:border-stone-300 select-none cursor-pointer"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Badges Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.badge && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black text-white shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Quick View Button on Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setQuickViewProduct(product);
        }}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 flex items-center justify-center text-stone-600 hover:text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="Xem nhanh chi tiết"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Product Image with Smooth Dual Angle Switch */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F6F5F2] flex items-center justify-center">
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
          loading="lazy"
        />
        {/* Secondary Angle Image on Hover */}
        <img
          src={product.hoverImage}
          alt={`${product.name} góc khác`}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
          }`}
          loading="lazy"
        />

        {/* Floating Quick Add Button (Sliding Up on Hover) */}
        <div className="absolute bottom-3 inset-x-3 z-10">
          <motion.button
            initial={false}
            animate={{
              y: isHovered ? 0 : 40,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-black text-white hover:bg-stone-800'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Đã thêm vào giỏ!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Thêm vào giỏ hàng
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-stone-900 text-base line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* Stock Status & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              product.inStock
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-stone-500 bg-stone-100'
            }`}
          >
            {product.inStock ? 'Còn hàng' : 'Tạm hết'}
          </span>

          {/* Pricing */}
          <div className="text-right">
            {formattedOriginalPrice && (
              <span className="text-[11px] text-stone-400 line-through mr-1.5">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-base font-extrabold text-stone-900">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
