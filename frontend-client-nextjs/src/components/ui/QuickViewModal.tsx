'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, Truck, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const images = [quickViewProduct.image, quickViewProduct.hoverImage];
  const currentColor = selectedColor || quickViewProduct.colors?.[0]?.name;

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity, currentColor);
    setIsAdded(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4F442', '#FF6B4A', '#2D4A3E'],
    });
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(quickViewProduct.price);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Image Viewport */}
            <div className="p-6 bg-[#F8F7F4] flex flex-col justify-between">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm">
                <img
                  src={images[activeImageIndex]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-black scale-105 shadow-sm'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  {quickViewProduct.category}
                </span>

                <h2 className="text-2xl font-black text-stone-900 mt-1">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    {quickViewProduct.rating}
                  </div>
                  <span className="text-xs text-stone-400">
                    ({quickViewProduct.reviewsCount} đánh giá từ chủ nuôi)
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-stone-900 mt-3">
                  {formattedPrice}
                </div>

                <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Colors */}
                {quickViewProduct.colors && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-stone-700 block mb-2">
                      Chọn phiên bản màu:
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                            currentColor === c.name
                              ? 'border-black bg-black text-white'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specs */}
                {quickViewProduct.specs && (
                  <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(quickViewProduct.specs).map(([k, v]) => (
                      <div key={k} className="p-2 rounded-lg bg-stone-50">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">
                          {k}
                        </span>
                        <span className="text-stone-800 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                {/* Qty */}
                <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-stone-500 hover:text-black cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 text-stone-500 hover:text-black cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add CTA */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-transform cursor-pointer active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-white hover:bg-stone-800 shadow-xl'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã thêm thành công!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Thêm vào giỏ ({formattedPrice})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
